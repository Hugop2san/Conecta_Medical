using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class DisponibilidadeMedicoService(
    IRepository<DisponibilidadeMedico> repository,
    IRepository<Medico> medicoRepository) : CrudService<DisponibilidadeMedico>(repository)
{
    public override async Task<DisponibilidadeMedico> CreateAsync(DisponibilidadeMedico entity, CancellationToken ct = default)
    {
        await ValidarAsync(entity, null, ct);
        return await base.CreateAsync(entity, ct);
    }

    public override async Task<DisponibilidadeMedico> UpdateAsync(Guid id, DisponibilidadeMedico entity, CancellationToken ct = default)
    {
        await ValidarAsync(entity, id, ct);
        return await base.UpdateAsync(id, entity, ct);
    }

    private async Task ValidarAsync(DisponibilidadeMedico entity, Guid? idIgnorado, CancellationToken ct)
    {
        TimeRange.EnsureValid(entity.HoraInicio, entity.HoraFim, "disponibilidade do medico");
        var medico = await medicoRepository.GetByIdAsync(entity.MedicoId, ct);
        if (medico is null || !medico.Ativo)
        {
            throw new BusinessRuleException("Medico nao encontrado ou inativo.");
        }

        var disponibilidades = await Repository.GetAllAsync(ct);
        var existeConflito = disponibilidades.Any(x =>
            x.Id != idIgnorado &&
            x.MedicoId == entity.MedicoId &&
            x.Data == entity.Data &&
            x.Modalidade == entity.Modalidade &&
            TimeRange.Overlaps(x.HoraInicio, x.HoraFim, entity.HoraInicio, entity.HoraFim));

        if (existeConflito)
        {
            throw new BusinessRuleException("Horario conflita com outra disponibilidade do medico.");
        }
    }
}
