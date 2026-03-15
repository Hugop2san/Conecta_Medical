using System.Collections.Concurrent;
using System.Text.Json;
using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Infrastructure.Repositories;

public class JsonFileRepository<T>(IHostEnvironment environment) : IRepository<T> where T : class, IEntity
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new();
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    private readonly string _path = Path.Combine(environment.ContentRootPath, "Data", CollectionFileNameResolver.Resolve<T>());

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
    {
        var items = await ReadAsync(ct);
        return items;
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var items = await ReadAsync(ct);
        return items.FirstOrDefault(x => x.Id == id);
    }

    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        var sem = GetLock();
        await sem.WaitAsync(ct);
        try
        {
            var items = await ReadUnsafeAsync(ct);
            if (entity.Id == Guid.Empty)
            {
                entity.Id = Guid.NewGuid();
            }

            items.Add(entity);
            await WriteUnsafeAsync(items, ct);
            return entity;
        }
        finally
        {
            sem.Release();
        }
    }

    public async Task<T> UpdateAsync(T entity, CancellationToken ct = default)
    {
        var sem = GetLock();
        await sem.WaitAsync(ct);
        try
        {
            var items = await ReadUnsafeAsync(ct);
            var index = items.FindIndex(x => x.Id == entity.Id);
            if (index < 0)
            {
                throw new BusinessRuleException("Registro nao encontrado.");
            }

            items[index] = entity;
            await WriteUnsafeAsync(items, ct);
            return entity;
        }
        finally
        {
            sem.Release();
        }
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var sem = GetLock();
        await sem.WaitAsync(ct);
        try
        {
            var items = await ReadUnsafeAsync(ct);
            items.RemoveAll(x => x.Id == id);
            await WriteUnsafeAsync(items, ct);
        }
        finally
        {
            sem.Release();
        }
    }

    private SemaphoreSlim GetLock() => Locks.GetOrAdd(_path, _ => new SemaphoreSlim(1, 1));

    private async Task<List<T>> ReadAsync(CancellationToken ct)
    {
        var sem = GetLock();
        await sem.WaitAsync(ct);
        try
        {
            return await ReadUnsafeAsync(ct);
        }
        finally
        {
            sem.Release();
        }
    }

    private async Task<List<T>> ReadUnsafeAsync(CancellationToken ct)
    {
        EnsureFileExists();
        await using var stream = File.Open(_path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        var data = await JsonSerializer.DeserializeAsync<List<T>>(stream, JsonOptions, ct);
        return data ?? [];
    }

    private async Task WriteUnsafeAsync(List<T> items, CancellationToken ct)
    {
        EnsureFileExists();
        await using var stream = File.Open(_path, FileMode.Create, FileAccess.Write, FileShare.None);
        await JsonSerializer.SerializeAsync(stream, items, JsonOptions, ct);
    }

    private void EnsureFileExists()
    {
        var directory = Path.GetDirectoryName(_path)!;
        Directory.CreateDirectory(directory);
        if (!File.Exists(_path))
        {
            File.WriteAllText(_path, "[]");
        }
    }
}
