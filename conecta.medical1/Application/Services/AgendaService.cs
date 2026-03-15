using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;
using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Services;

public class AgendaService(
    IRepository<Medico> medicoRepository,
    IRepository<SalaParceira> salaRepository,
    IRepository<DisponibilidadeMedico> disponibilidadeMedicoRepository,
    IRepository<DisponibilidadeSala> disponibilidadeSalaRepository,
    IRepository<Consulta> consultaRepository) : IAgendaService
{
    private static readonly TimeSpan SlotDuration = TimeSpan.FromMinutes(30);

    public async Task<IReadOnlyList<HorarioDisponivelResponse>> ListarDisponibilidadeAsync(
        Guid medicoId,
        DateOnly data,
        ModalidadeConsulta modalidade,
        CancellationToken ct = default)
    {
        var medico = await medicoRepository.GetByIdAsync(medicoId, ct);
        if (medico is null || !medico.Ativo)
        {
            throw new BusinessRuleException("Medico nao encontrado ou inativo.");
        }

        var disponibilidadesMedico = (await disponibilidadeMedicoRepository.GetAllAsync(ct))
            .Where(x => x.MedicoId == medicoId && x.Data == data && x.Modalidade == modalidade)
            .ToList();

        var consultasNoDia = (await consultaRepository.GetAllAsync(ct))
            .Where(x => x.Data == data && ConsultaStatusHelper.OcupaAgenda(x.Status))
            .ToList();

        var horarios = modalidade == ModalidadeConsulta.Online
            ? MontarSlotsOnline(disponibilidadesMedico, consultasNoDia, data)
            : await MontarSlotsPresenciais(disponibilidadesMedico, consultasNoDia, data, ct);

        return horarios
            .OrderBy(x => x.HoraInicio)
            .ThenBy(x => x.SalaParceiraId)
            .ToList();
    }

    private static IReadOnlyList<HorarioDisponivelResponse> MontarSlotsOnline(
        IReadOnlyList<DisponibilidadeMedico> disponibilidadesMedico,
        IReadOnlyList<Consulta> consultasNoDia,
        DateOnly data)
    {
        var result = new List<HorarioDisponivelResponse>();

        foreach (var disponibilidade in disponibilidadesMedico)
        {
            foreach (var slot in EnumerarSlots(disponibilidade.HoraInicio, disponibilidade.HoraFim))
            {
                var conflitoMedico = consultasNoDia.Any(c =>
                    c.MedicoId == disponibilidade.MedicoId &&
                    TimeRange.Overlaps(c.HoraInicio, c.HoraFim, slot.inicio, slot.fim));

                if (!conflitoMedico)
                {
                    result.Add(new HorarioDisponivelResponse
                    {
                        Data = data,
                        HoraInicio = slot.inicio,
                        HoraFim = slot.fim
                    });
                }
            }
        }

        return result;
    }

    private async Task<IReadOnlyList<HorarioDisponivelResponse>> MontarSlotsPresenciais(
        IReadOnlyList<DisponibilidadeMedico> disponibilidadesMedico,
        IReadOnlyList<Consulta> consultasNoDia,
        DateOnly data,
        CancellationToken ct)
    {
        var salas = (await salaRepository.GetAllAsync(ct))
            .Where(x => x.Ativa)
            .ToDictionary(x => x.Id);

        var disponibilidadesSala = (await disponibilidadeSalaRepository.GetAllAsync(ct))
            .Where(x => x.Data == data && x.Ativa && salas.ContainsKey(x.SalaParceiraId))
            .ToList();

        var result = new List<HorarioDisponivelResponse>();

        foreach (var dispMedico in disponibilidadesMedico)
        {
            foreach (var dispSala in disponibilidadesSala)
            {
                var inicio = Max(dispMedico.HoraInicio, dispSala.HoraInicio);
                var fim = Min(dispMedico.HoraFim, dispSala.HoraFim);
                if (inicio >= fim)
                {
                    continue;
                }

                foreach (var slot in EnumerarSlots(inicio, fim))
                {
                    var conflitoMedico = consultasNoDia.Any(c =>
                        c.MedicoId == dispMedico.MedicoId &&
                        TimeRange.Overlaps(c.HoraInicio, c.HoraFim, slot.inicio, slot.fim));

                    var conflitoSala = consultasNoDia.Any(c =>
                        c.SalaParceiraId == dispSala.SalaParceiraId &&
                        TimeRange.Overlaps(c.HoraInicio, c.HoraFim, slot.inicio, slot.fim));

                    if (!conflitoMedico && !conflitoSala)
                    {
                        var sala = salas[dispSala.SalaParceiraId];
                        result.Add(new HorarioDisponivelResponse
                        {
                            Data = data,
                            HoraInicio = slot.inicio,
                            HoraFim = slot.fim,
                            SalaParceiraId = dispSala.SalaParceiraId,
                            NomeSala = sala.NomeSala
                        });
                    }
                }
            }
        }

        return result
            .GroupBy(x => new { x.Data, x.HoraInicio, x.HoraFim, x.SalaParceiraId })
            .Select(x => x.First())
            .ToList();
    }

    private static IEnumerable<(TimeOnly inicio, TimeOnly fim)> EnumerarSlots(TimeOnly inicio, TimeOnly fim)
    {
        var cursor = inicio;
        while (cursor.Add(SlotDuration) <= fim)
        {
            var next = cursor.Add(SlotDuration);
            yield return (cursor, next);
            cursor = next;
        }
    }

    private static TimeOnly Max(TimeOnly a, TimeOnly b) => a > b ? a : b;
    private static TimeOnly Min(TimeOnly a, TimeOnly b) => a < b ? a : b;
}
