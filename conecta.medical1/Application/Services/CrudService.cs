using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Services;

public class CrudService<T>(IRepository<T> repository) : ICrudService<T> where T : class, IEntity
{
    protected readonly IRepository<T> Repository = repository;

    public virtual Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
        => Repository.GetAllAsync(ct);

    public virtual Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Repository.GetByIdAsync(id, ct);

    public virtual Task<T> CreateAsync(T entity, CancellationToken ct = default)
        => Repository.AddAsync(entity, ct);

    public virtual async Task<T> UpdateAsync(Guid id, T entity, CancellationToken ct = default)
    {
        var current = await Repository.GetByIdAsync(id, ct);
        if (current is null)
        {
            throw new BusinessRuleException("Registro nao encontrado.");
        }

        entity.Id = id;
        return await Repository.UpdateAsync(entity, ct);
    }

    public virtual async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var current = await Repository.GetByIdAsync(id, ct);
        if (current is null)
        {
            throw new BusinessRuleException("Registro nao encontrado.");
        }

        await Repository.DeleteAsync(id, ct);
    }
}
