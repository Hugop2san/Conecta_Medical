using conecta.medical1.Application.Contracts;

namespace conecta.medical1.Application.Services;

public class SystemClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}
