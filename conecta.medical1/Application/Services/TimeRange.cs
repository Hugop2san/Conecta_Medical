namespace conecta.medical1.Application.Services;

public static class TimeRange
{
    public static bool Overlaps(TimeOnly startA, TimeOnly endA, TimeOnly startB, TimeOnly endB)
        => startA < endB && startB < endA;

    public static void EnsureValid(TimeOnly inicio, TimeOnly fim, string contexto)
    {
        if (inicio >= fim)
        {
            throw new ArgumentException($"Intervalo de horario invalido para {contexto}.");
        }
    }
}
