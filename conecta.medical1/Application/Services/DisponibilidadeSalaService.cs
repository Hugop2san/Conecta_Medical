using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class DisponibilidadeSalaService(
    IRepository<DisponibilidadeSala> repository,
    IRepository<SalaParceira> salaRepository) : CrudService<DisponibilidadeSala>(repository)
{
    public override async Task<DisponibilidadeSala> CreateAsync(DisponibilidadeSala entity, CancellationToken ct = default)
    {
        await ValidarAsync(entity, null, ct);
        return await base.CreateAsync(entity, ct);
    }

    public override async Task<DisponibilidadeSala> UpdateAsync(Guid id, DisponibilidadeSala entity, CancellationToken ct = default)
    {
        await ValidarAsync(entity, id, ct);
        return await base.UpdateAsync(id, entity, ct);
    }

    private async Task ValidarAsync(DisponibilidadeSala entity, Guid? idIgnorado, CancellationToken ct)
    {
        TimeRange.EnsureValid(entity.HoraInicio, entity.HoraFim, "disponibilidade da sala");
        if (entity.PrecoSala < 0)
        {
            throw new BusinessRuleException("Preco da sala nao pode ser negativo.");
        }

        var sala = await salaRepository.GetByIdAsync(entity.SalaParceiraId, ct);
        if (sala is null || !sala.Ativa)
        {
            throw new BusinessRuleException("Sala nao encontrada ou inativa.");
        }

        var disponibilidades = await Repository.GetAllAsync(ct);
        var existeConflito = disponibilidades.Any(x =>
            x.Id != idIgnorado &&
            x.SalaParceiraId == entity.SalaParceiraId &&
            x.Data == entity.Data &&
            TimeRange.Overlaps(x.HoraInicio, x.HoraFim, entity.HoraInicio, entity.HoraFim));

        if (existeConflito)
        {
            throw new BusinessRuleException("Horario conflita com outra disponibilidade da sala.");
        }
    }
}
