using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Domain.Entities;

public class MensagemConversa
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public AutorMensagem Autor { get; set; }
    public string Texto { get; set; } = string.Empty;
    public DateTime CriadaEmUtc { get; set; }
}
