using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class PrecoService(
    IRepository<Medico> medicoRepository,
    IRepository<SalaParceira> salaRepository) : IPrecoService
{
    public async Task<IReadOnlyList<Medico>> ListarPrecosMedicosAsync(CancellationToken ct = default)
    {
        var medicos = await medicoRepository.GetAllAsync(ct);
        return medicos
            .Where(x => x.Ativo)
            .OrderBy(x => x.PrecoConsultaHora)
            .ThenBy(x => x.Nome)
            .ToList();
    }

    public async Task<SomatorioPrecoResponse> SomarPrecoMedicoSalaAsync(Guid medicoId, Guid? salaParceiraId, CancellationToken ct = default)
    {
        var medico = await medicoRepository.GetByIdAsync(medicoId, ct);
        if (medico is null || !medico.Ativo)
        {
            throw new BusinessRuleException("Medico nao encontrado ou inativo.");
        }

        decimal precoSala = 0;
        if (salaParceiraId.HasValue)
        {
            var sala = await salaRepository.GetByIdAsync(salaParceiraId.Value, ct);
            if (sala is null || !sala.Ativa)
            {
                throw new BusinessRuleException("Sala nao encontrada ou inativa.");
            }

            precoSala = sala.PrecoAluguelHora;
        }

        return new SomatorioPrecoResponse
        {
            MedicoId = medicoId,
            SalaParceiraId = salaParceiraId,
            PrecoMedico = medico.PrecoConsultaHora,
            PrecoSala = precoSala,
            Total = medico.PrecoConsultaHora + precoSala
        };
    }
}
