using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Domain.Entities;

public class DisponibilidadeMedico : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MedicoId { get; set; }
    public DateOnly Data { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public ModalidadeConsulta Modalidade { get; set; } = ModalidadeConsulta.Presencial;
}
