namespace conecta.medical1.Application.Dtos;

public class HorarioDisponivelResponse
{
    public DateOnly Data { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public Guid? SalaParceiraId { get; set; }
    public string? NomeSala { get; set; }
}
