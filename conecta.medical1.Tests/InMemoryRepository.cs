using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Tests;

public class InMemoryRepository<T>(IEnumerable<T>? seed = null) : IRepository<T> where T : class, IEntity
{
    private readonly List<T> _items = seed?.ToList() ?? [];

    public Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
        => Task.FromResult((IReadOnlyList<T>)_items.ToList());

    public Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Task.FromResult(_items.FirstOrDefault(x => x.Id == id));

    public Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        _items.Add(entity);
        return Task.FromResult(entity);
    }

    public Task<T> UpdateAsync(T entity, CancellationToken ct = default)
    {
        var index = _items.FindIndex(x => x.Id == entity.Id);
        if (index >= 0)
        {
            _items[index] = entity;
        }

        return Task.FromResult(entity);
    }

    public Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        _items.RemoveAll(x => x.Id == id);
        return Task.CompletedTask;
    }
}
