using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class MedicoService(IRepository<Medico> repository) : CrudService<Medico>(repository)
{
    public override async Task<Medico> CreateAsync(Medico entity, CancellationToken ct = default)
    {
        await EnsureCrmUnico(entity.Crm, null, ct);
        return await base.CreateAsync(entity, ct);
    }

    public override async Task<Medico> UpdateAsync(Guid id, Medico entity, CancellationToken ct = default)
    {
        await EnsureCrmUnico(entity.Crm, id, ct);
        return await base.UpdateAsync(id, entity, ct);
    }

    private async Task EnsureCrmUnico(string crm, Guid? idIgnorado, CancellationToken ct)
    {
        var medicos = await Repository.GetAllAsync(ct);
        var crmExiste = medicos.Any(x =>
            x.Crm.Equals(crm, StringComparison.OrdinalIgnoreCase) &&
            x.Id != idIgnorado);

        if (crmExiste)
        {
            throw new BusinessRuleException("CRM ja cadastrado.");
        }
    }
}
