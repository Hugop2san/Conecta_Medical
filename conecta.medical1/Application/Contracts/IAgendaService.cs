using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Contracts;

public interface IAgendaService
{
    Task<IReadOnlyList<HorarioDisponivelResponse>> ListarDisponibilidadeAsync(
        Guid medicoId,
        DateOnly data,
        ModalidadeConsulta modalidade,
        CancellationToken ct = default);
}
