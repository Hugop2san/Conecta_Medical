namespace conecta.medical1.Domain.Entities;

public class Medico : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public string Crm { get; set; } = string.Empty;
    public string Especialidade { get; set; } = "Clinica Geral";
    public decimal PrecoConsultaHora { get; set; }
    public int AtendimentosPorHora { get; set; } = 1;
    public bool Ativo { get; set; } = true;
}
