namespace conecta.medical1.Application.Contracts;

public interface IClock
{
    DateTime UtcNow { get; }
}
