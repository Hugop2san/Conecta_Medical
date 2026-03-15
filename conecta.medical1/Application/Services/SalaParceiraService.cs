using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class SalaParceiraService(IRepository<SalaParceira> repository) : CrudService<SalaParceira>(repository)
{
    public override Task<SalaParceira> CreateAsync(SalaParceira entity, CancellationToken ct = default)
    {
        Validar(entity);
        return base.CreateAsync(entity, ct);
    }

    public override Task<SalaParceira> UpdateAsync(Guid id, SalaParceira entity, CancellationToken ct = default)
    {
        Validar(entity);
        return base.UpdateAsync(id, entity, ct);
    }

    private static void Validar(SalaParceira entity)
    {
        if (entity.PrecoAluguelHora < 0)
        {
            throw new BusinessRuleException("Preco de aluguel da sala nao pode ser negativo.");
        }
    }
}
