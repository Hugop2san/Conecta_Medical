using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class PacienteService(IRepository<Paciente> repository) : CrudService<Paciente>(repository)
{
    public override async Task<Paciente> CreateAsync(Paciente entity, CancellationToken ct = default)
    {
        await EnsureCpfUnico(entity.Cpf, null, ct);
        return await base.CreateAsync(entity, ct);
    }

    public override async Task<Paciente> UpdateAsync(Guid id, Paciente entity, CancellationToken ct = default)
    {
        await EnsureCpfUnico(entity.Cpf, id, ct);
        return await base.UpdateAsync(id, entity, ct);
    }

    private async Task EnsureCpfUnico(string cpf, Guid? idIgnorado, CancellationToken ct)
    {
        var pacientes = await Repository.GetAllAsync(ct);
        var existe = pacientes.Any(x =>
            x.Cpf.Equals(cpf, StringComparison.OrdinalIgnoreCase) &&
            x.Id != idIgnorado);

        if (existe)
        {
            throw new BusinessRuleException("CPF ja cadastrado.");
        }
    }
}
