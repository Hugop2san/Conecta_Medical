using System.Text.Json;
using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Infrastructure.Seed;

public class JsonDataSeeder(
    IHostEnvironment environment,
    IRepository<SalaParceira> salaRepository,
    IRepository<DisponibilidadeSala> disponibilidadeSalaRepository) : IDataSeeder
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task SeedAsync(CancellationToken ct = default)
    {
        var seedRoot = Path.Combine(environment.ContentRootPath, "SeedData");
        await SeedSalas(seedRoot, ct);
        await SeedDisponibilidadesSalas(seedRoot, ct);
    }

    private async Task SeedSalas(string seedRoot, CancellationToken ct)
    {
        var seedPath = Path.Combine(seedRoot, "salas.seed.json");
        if (!File.Exists(seedPath))
        {
            return;
        }

        var json = await File.ReadAllTextAsync(seedPath, ct);
        var seeds = JsonSerializer.Deserialize<List<SalaParceira>>(json, JsonOptions) ?? [];
        var atuais = await salaRepository.GetAllAsync(ct);
        var idsAtuais = atuais.Select(x => x.Id).ToHashSet();

        foreach (var item in seeds.Where(x => !idsAtuais.Contains(x.Id)))
        {
            await salaRepository.AddAsync(item, ct);
        }
    }

    private async Task SeedDisponibilidadesSalas(string seedRoot, CancellationToken ct)
    {
        var seedPath = Path.Combine(seedRoot, "disponibilidades-salas.seed.json");
        if (!File.Exists(seedPath))
        {
            return;
        }

        var json = await File.ReadAllTextAsync(seedPath, ct);
        var seeds = JsonSerializer.Deserialize<List<DisponibilidadeSala>>(json, JsonOptions) ?? [];
        var atuais = await disponibilidadeSalaRepository.GetAllAsync(ct);
        var idsAtuais = atuais.Select(x => x.Id).ToHashSet();

        foreach (var item in seeds.Where(x => !idsAtuais.Contains(x.Id)))
        {
            await disponibilidadeSalaRepository.AddAsync(item, ct);
        }
    }
}
