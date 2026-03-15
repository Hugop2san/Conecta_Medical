using conecta.medical1.Domain.Entities;
using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Dtos;

public class ConversaPacienteResponse
{
    public Guid ConversaId { get; set; }
    public Guid? PacienteId { get; set; }
    public string NomePaciente { get; set; } = string.Empty;
    public string TelefonePaciente { get; set; } = string.Empty;
    public string? EmailPaciente { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public decimal? OrcamentoMaximo { get; set; }
    public StatusConversaPaciente Status { get; set; }
    public DateTime CriadaEmUtc { get; set; }
    public DateTime AtualizadaEmUtc { get; set; }
    public IReadOnlyList<MensagemConversa> Mensagens { get; set; } = [];
}
