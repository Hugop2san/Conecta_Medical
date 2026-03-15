using conecta.medical1.Application.Contracts;

namespace conecta.medical1.Tests;

public class FakeClock(DateTime nowUtc) : IClock
{
    public DateTime UtcNow { get; set; } = nowUtc;
}
