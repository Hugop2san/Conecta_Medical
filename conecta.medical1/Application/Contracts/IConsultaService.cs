using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Application.Contracts;

public interface IConsultaService
{
    Task<Consulta> AgendarAsync(AgendarConsultaRequest request, CancellationToken ct = default);
    Task<Consulta> ConfirmarAsync(Guid consultaId, string codigoConfirmacao, CancellationToken ct = default);
    Task<Consulta> CancelarAsync(Guid consultaId, string motivo, CancellationToken ct = default);
    Task<IReadOnlyList<Consulta>> ListarAsync(Guid? medicoId, Guid? pacienteId, DateOnly? data, CancellationToken ct = default);
}
