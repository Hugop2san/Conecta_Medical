using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Contracts;

public interface IRepository<T> where T : class, IEntity
{
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task<T> UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
