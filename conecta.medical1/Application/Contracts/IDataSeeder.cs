namespace conecta.medical1.Application.Contracts;

public interface IDataSeeder
{
    Task SeedAsync(CancellationToken ct = default);
}
