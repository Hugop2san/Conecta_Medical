using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Contracts;

public interface IPrecoService
{
    Task<IReadOnlyList<Medico>> ListarPrecosMedicosAsync(CancellationToken ct = default);
    Task<SomatorioPrecoResponse> SomarPrecoMedicoSalaAsync(Guid medicoId, Guid? salaParceiraId, CancellationToken ct = default);
}
