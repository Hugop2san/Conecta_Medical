namespace conecta.medical1.Domain.Entities;

public class DisponibilidadeSala : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SalaParceiraId { get; set; }
    public DateOnly Data { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public decimal PrecoSala { get; set; }
    public bool Ativa { get; set; } = true;
}
