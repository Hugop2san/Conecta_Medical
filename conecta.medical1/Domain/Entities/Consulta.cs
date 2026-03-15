using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Domain.Entities;

public class Consulta : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PacienteId { get; set; }
    public Guid MedicoId { get; set; }
    public Guid? SalaParceiraId { get; set; }
    public DateOnly Data { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public StatusConsulta Status { get; set; } = StatusConsulta.Pendente;
    public string CodigoConfirmacao { get; set; } = string.Empty;
    public decimal PrecoConsulta { get; set; }
    public string? MotivoCancelamento { get; set; }
    public DateTime ExpiraEmUtc { get; set; }
}
