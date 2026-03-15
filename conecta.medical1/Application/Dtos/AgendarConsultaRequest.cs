using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Dtos;

public class AgendarConsultaRequest
{
    public Guid PacienteId { get; set; }
    public Guid MedicoId { get; set; }
    public Guid? SalaParceiraId { get; set; }
    public DateOnly Data { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public ModalidadeConsulta Modalidade { get; set; }
}
