using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Contracts;

public interface ICrudService<T> where T : class, IEntity
{
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<T> CreateAsync(T entity, CancellationToken ct = default);
    Task<T> UpdateAsync(Guid id, T entity, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
