namespace conecta.medical1.Domain.Entities;

public class SalaParceira : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string NomeSala { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = "Sao Paulo";
    public decimal PrecoAluguelHora { get; set; }
    public bool Ativa { get; set; } = true;
}
