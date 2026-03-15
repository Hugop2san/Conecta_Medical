using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;
using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Services;

public class ConsultaService(
    IRepository<Consulta> consultaRepository,
    IRepository<Medico> medicoRepository,
    IRepository<Paciente> pacienteRepository,
    IRepository<SalaParceira> salaRepository,
    IRepository<DisponibilidadeMedico> disponibilidadeMedicoRepository,
    IRepository<DisponibilidadeSala> disponibilidadeSalaRepository,
    IClock clock) : IConsultaService
{
    public async Task<Consulta> AgendarAsync(AgendarConsultaRequest request, CancellationToken ct = default)
    {
        TimeRange.EnsureValid(request.HoraInicio, request.HoraFim, "consulta");

        var medico = await medicoRepository.GetByIdAsync(request.MedicoId, ct);
        if (medico is null || !medico.Ativo)
        {
            throw new BusinessRuleException("Medico nao encontrado ou inativo.");
        }

        var paciente = await pacienteRepository.GetByIdAsync(request.PacienteId, ct);
        if (paciente is null)
        {
            throw new BusinessRuleException("Paciente nao encontrado.");
        }

        await ValidarDisponibilidadeMedico(request, ct);
        await ValidarSalaSeNecessario(request, ct);
        await ValidarConflitosAgenda(request, ct);

        var consulta = new Consulta
        {
            PacienteId = request.PacienteId,
            MedicoId = request.MedicoId,
            SalaParceiraId = request.Modalidade == ModalidadeConsulta.Online ? null : request.SalaParceiraId,
            Data = request.Data,
            HoraInicio = request.HoraInicio,
            HoraFim = request.HoraFim,
            PrecoConsulta = medico.PrecoConsultaHora,
            Status = StatusConsulta.Pendente,
            CodigoConfirmacao = GerarCodigoConfirmacao(),
            ExpiraEmUtc = clock.UtcNow.AddMinutes(2)
        };

        return await consultaRepository.AddAsync(consulta, ct);
    }

    public async Task<Consulta> ConfirmarAsync(Guid consultaId, string codigoConfirmacao, CancellationToken ct = default)
    {
        var consulta = await consultaRepository.GetByIdAsync(consultaId, ct);
        if (consulta is null)
        {
            throw new BusinessRuleException("Consulta nao encontrada.");
        }

        if (consulta.Status == StatusConsulta.Cancelada)
        {
            throw new BusinessRuleException("Consulta ja esta cancelada.");
        }

        if (consulta.Status == StatusConsulta.Concluida)
        {
            throw new BusinessRuleException("Consulta ja esta concluida.");
        }

        if (consulta.Status == StatusConsulta.Confirmada)
        {
            return consulta;
        }

        if (clock.UtcNow > consulta.ExpiraEmUtc)
        {
            consulta.Status = StatusConsulta.Cancelada;
            consulta.MotivoCancelamento = "medico nao aceitou no tempo limite";
            await consultaRepository.UpdateAsync(consulta, ct);
            throw new BusinessRuleException("medico nao aceitou no tempo limite");
        }

        if (!consulta.CodigoConfirmacao.Equals(codigoConfirmacao, StringComparison.OrdinalIgnoreCase))
        {
            throw new BusinessRuleException("Codigo de confirmacao invalido.");
        }

        consulta.Status = StatusConsulta.Confirmada;
        return await consultaRepository.UpdateAsync(consulta, ct);
    }

    public async Task<Consulta> CancelarAsync(Guid consultaId, string motivo, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(motivo))
        {
            throw new BusinessRuleException("Motivo do cancelamento e obrigatorio.");
        }

        var consulta = await consultaRepository.GetByIdAsync(consultaId, ct);
        if (consulta is null)
        {
            throw new BusinessRuleException("Consulta nao encontrada.");
        }

        if (consulta.Status == StatusConsulta.Cancelada)
        {
            return consulta;
        }

        consulta.Status = StatusConsulta.Cancelada;
        consulta.MotivoCancelamento = motivo.Trim();
        return await consultaRepository.UpdateAsync(consulta, ct);
    }

    public async Task<IReadOnlyList<Consulta>> ListarAsync(Guid? medicoId, Guid? pacienteId, DateOnly? data, CancellationToken ct = default)
    {
        var consultas = await consultaRepository.GetAllAsync(ct);

        return consultas
            .Where(x => !medicoId.HasValue || x.MedicoId == medicoId)
            .Where(x => !pacienteId.HasValue || x.PacienteId == pacienteId)
            .Where(x => !data.HasValue || x.Data == data)
            .OrderBy(x => x.Data)
            .ThenBy(x => x.HoraInicio)
            .ToList();
    }

    private async Task ValidarDisponibilidadeMedico(AgendarConsultaRequest request, CancellationToken ct)
    {
        var disponibilidade = (await disponibilidadeMedicoRepository.GetAllAsync(ct)).Any(x =>
            x.MedicoId == request.MedicoId &&
            x.Data == request.Data &&
            x.Modalidade == request.Modalidade &&
            x.HoraInicio <= request.HoraInicio &&
            x.HoraFim >= request.HoraFim);

        if (!disponibilidade)
        {
            throw new BusinessRuleException("Medico nao disponivel no intervalo solicitado.");
        }
    }

    private async Task ValidarSalaSeNecessario(AgendarConsultaRequest request, CancellationToken ct)
    {
        if (request.Modalidade == ModalidadeConsulta.Online)
        {
            return;
        }

        if (!request.SalaParceiraId.HasValue)
        {
            throw new BusinessRuleException("Sala parceira e obrigatoria para consulta presencial.");
        }

        var sala = await salaRepository.GetByIdAsync(request.SalaParceiraId.Value, ct);
        if (sala is null || !sala.Ativa)
        {
            throw new BusinessRuleException("Sala nao encontrada ou inativa.");
        }

        var salaDisponivel = (await disponibilidadeSalaRepository.GetAllAsync(ct)).Any(x =>
            x.SalaParceiraId == request.SalaParceiraId.Value &&
            x.Data == request.Data &&
            x.Ativa &&
            x.HoraInicio <= request.HoraInicio &&
            x.HoraFim >= request.HoraFim);

        if (!salaDisponivel)
        {
            throw new BusinessRuleException("Sala indisponivel no intervalo solicitado.");
        }
    }

    private async Task ValidarConflitosAgenda(AgendarConsultaRequest request, CancellationToken ct)
    {
        var consultas = (await consultaRepository.GetAllAsync(ct))
            .Where(x => x.Data == request.Data && ConsultaStatusHelper.OcupaAgenda(x.Status))
            .ToList();

        var conflitoMedico = consultas.Any(x =>
            x.MedicoId == request.MedicoId &&
            TimeRange.Overlaps(x.HoraInicio, x.HoraFim, request.HoraInicio, request.HoraFim));

        if (conflitoMedico)
        {
            throw new BusinessRuleException("Conflito de horario para medico.");
        }

        var conflitoPaciente = consultas.Any(x =>
            x.PacienteId == request.PacienteId &&
            TimeRange.Overlaps(x.HoraInicio, x.HoraFim, request.HoraInicio, request.HoraFim));

        if (conflitoPaciente)
        {
            throw new BusinessRuleException("Conflito de horario para paciente.");
        }

        if (request.Modalidade == ModalidadeConsulta.Presencial && request.SalaParceiraId.HasValue)
        {
            var conflitoSala = consultas.Any(x =>
                x.SalaParceiraId == request.SalaParceiraId &&
                TimeRange.Overlaps(x.HoraInicio, x.HoraFim, request.HoraInicio, request.HoraFim));

            if (conflitoSala)
            {
                throw new BusinessRuleException("Conflito de horario para sala.");
            }
        }
    }

    private static string GerarCodigoConfirmacao()
        => Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
}
