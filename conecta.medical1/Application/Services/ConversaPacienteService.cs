using System.Net.Http.Json;
using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;
using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Services;

public class ConversaPacienteService(
    IRepository<ConversaPaciente> conversaRepository,
    IRepository<Paciente> pacienteRepository,
    IClock clock,
    IHttpClientFactory httpClientFactory) : IConversaPacienteService
{
    private const string N8nWebhookUrl = "https://conecta-medical.app.n8n.cloud/webhook/aihelper";

    public async Task<ConversaPacienteResponse> CriarMensagemPacienteAsync(CriarConversaPacienteRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Mensagem))
        {
            throw new BusinessRuleException("Mensagem do paciente e obrigatoria.");
        }

        var pacienteInfo = await ObterPacienteInfo(request, ct);
        var now = clock.UtcNow;
        var conversa = new ConversaPaciente
        {
            PacienteId = pacienteInfo.PacienteId,
            NomePaciente = pacienteInfo.NomePaciente,
            TelefonePaciente = pacienteInfo.TelefonePaciente,
            EmailPaciente = pacienteInfo.EmailPaciente,
            Bairro = pacienteInfo.Bairro,
            Cidade = pacienteInfo.Cidade,
            OrcamentoMaximo = request.OrcamentoMaximo,
            Status = StatusConversaPaciente.AguardandoRespostaAgente,
            CriadaEmUtc = now,
            AtualizadaEmUtc = now,
            Mensagens =
            [
                new MensagemConversa
                {
                    Autor = AutorMensagem.Paciente,
                    Texto = request.Mensagem.Trim(),
                    CriadaEmUtc = now
                }
            ]
        };

        var created = await conversaRepository.AddAsync(conversa, ct);
        var response = ToResponse(created);
        await EnviarWebhookNovaConversaAsync(response, ct);
        return response;
    }

    public async Task<ConversaPacienteResponse> RegistrarCallbackAgenteAsync(Guid conversaId, string mensagem, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(mensagem))
        {
            throw new BusinessRuleException("Mensagem do agente e obrigatoria.");
        }

        var conversa = await conversaRepository.GetByIdAsync(conversaId, ct);
        if (conversa is null)
        {
            throw new BusinessRuleException("Conversa nao encontrada.");
        }

        conversa.Mensagens.Add(new MensagemConversa
        {
            Autor = AutorMensagem.Agente,
            Texto = mensagem.Trim(),
            CriadaEmUtc = clock.UtcNow
        });

        conversa.Status = StatusConversaPaciente.Respondida;
        conversa.AtualizadaEmUtc = clock.UtcNow;

        var updated = await conversaRepository.UpdateAsync(conversa, ct);
        return ToResponse(updated);
    }

    public async Task<ConversaPacienteResponse?> ObterPorIdAsync(Guid conversaId, CancellationToken ct = default)
    {
        var conversa = await conversaRepository.GetByIdAsync(conversaId, ct);
        return conversa is null ? null : ToResponse(conversa);
    }

    public async Task<IReadOnlyList<ConversaPacienteResponse>> ListarPorPacienteAsync(Guid pacienteId, CancellationToken ct = default)
    {
        var conversas = await conversaRepository.GetAllAsync(ct);
        return conversas
            .Where(x => x.PacienteId == pacienteId)
            .OrderByDescending(x => x.AtualizadaEmUtc)
            .Select(ToResponse)
            .ToList();
    }

    private async Task<(Guid? PacienteId, string NomePaciente, string TelefonePaciente, string? EmailPaciente, string? Bairro, string? Cidade)> ObterPacienteInfo(
        CriarConversaPacienteRequest request,
        CancellationToken ct)
    {
        if (request.PacienteId.HasValue)
        {
            var paciente = await pacienteRepository.GetByIdAsync(request.PacienteId.Value, ct);
            if (paciente is null)
            {
                throw new BusinessRuleException("Paciente nao encontrado.");
            }

            return (
                paciente.Id,
                paciente.Nome,
                paciente.Telefone,
                paciente.Email,
                paciente.Bairro,
                paciente.Cidade);
        }

        if (string.IsNullOrWhiteSpace(request.NomePaciente) || string.IsNullOrWhiteSpace(request.TelefonePaciente))
        {
            throw new BusinessRuleException("Nome e telefone do paciente sao obrigatorios quando pacienteId nao for informado.");
        }

        return (
            null,
            request.NomePaciente.Trim(),
            request.TelefonePaciente.Trim(),
            request.EmailPaciente?.Trim(),
            request.Bairro?.Trim(),
            request.Cidade?.Trim());
    }

    private static ConversaPacienteResponse ToResponse(ConversaPaciente conversa)
        => new()
        {
            ConversaId = conversa.Id,
            PacienteId = conversa.PacienteId,
            NomePaciente = conversa.NomePaciente,
            TelefonePaciente = conversa.TelefonePaciente,
            EmailPaciente = conversa.EmailPaciente,
            Bairro = conversa.Bairro,
            Cidade = conversa.Cidade,
            OrcamentoMaximo = conversa.OrcamentoMaximo,
            Status = conversa.Status,
            CriadaEmUtc = conversa.CriadaEmUtc,
            AtualizadaEmUtc = conversa.AtualizadaEmUtc,
            Mensagens = conversa.Mensagens.OrderBy(x => x.CriadaEmUtc).ToList()
        };

    private async Task EnviarWebhookNovaConversaAsync(ConversaPacienteResponse conversa, CancellationToken ct)
    {
        var payload = new
        {
            evento = "nova_conversa_paciente",
            conversaId = conversa.ConversaId,
            pacienteId = conversa.PacienteId,
            nomePaciente = conversa.NomePaciente,
            telefonePaciente = conversa.TelefonePaciente,
            emailPaciente = conversa.EmailPaciente,
            bairro = conversa.Bairro,
            cidade = conversa.Cidade,
            orcamentoMaximo = conversa.OrcamentoMaximo,
            status = conversa.Status.ToString(),
            mensagemInicial = conversa.Mensagens.FirstOrDefault(x => x.Autor == AutorMensagem.Paciente)?.Texto,
            callbackEndpoint = $"/pacientes/agente/conversas/{conversa.ConversaId}/callback",
            criadoEmUtc = conversa.CriadaEmUtc
        };

        using var client = httpClientFactory.CreateClient();
        using var response = await client.PostAsJsonAsync(N8nWebhookUrl, payload, ct);
        response.EnsureSuccessStatusCode();
    }
}
