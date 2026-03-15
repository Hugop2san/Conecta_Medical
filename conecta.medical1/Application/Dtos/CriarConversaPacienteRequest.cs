namespace conecta.medical1.Application.Dtos;

public class CriarConversaPacienteRequest
{
    public Guid? PacienteId { get; set; }
    public string? NomePaciente { get; set; }
    public string? TelefonePaciente { get; set; }
    public string? EmailPaciente { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public decimal? OrcamentoMaximo { get; set; }
    public string Mensagem { get; set; } = string.Empty;
}
