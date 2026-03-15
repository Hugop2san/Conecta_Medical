using conecta.medical1.Application.Dtos;

namespace conecta.medical1.Application.Contracts;

public interface IConversaPacienteService
{
    Task<ConversaPacienteResponse> CriarMensagemPacienteAsync(CriarConversaPacienteRequest request, CancellationToken ct = default);
    Task<ConversaPacienteResponse> RegistrarCallbackAgenteAsync(Guid conversaId, string mensagem, CancellationToken ct = default);
    Task<ConversaPacienteResponse?> ObterPorIdAsync(Guid conversaId, CancellationToken ct = default);
    Task<IReadOnlyList<ConversaPacienteResponse>> ListarPorPacienteAsync(Guid pacienteId, CancellationToken ct = default);
}
