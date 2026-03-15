namespace conecta.medical1.Application.Dtos;

public class SomatorioPrecoResponse
{
    public Guid MedicoId { get; set; }
    public Guid? SalaParceiraId { get; set; }
    public decimal PrecoMedico { get; set; }
    public decimal PrecoSala { get; set; }
    public decimal Total { get; set; }
}
