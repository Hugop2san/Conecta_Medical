using conecta.medical1.Domain.Entities;

namespace conecta.medical1.Infrastructure.Repositories;

public static class CollectionFileNameResolver
{
    public static string Resolve<T>() where T : class, IEntity
        => typeof(T).Name switch
        {
            nameof(Medico) => "medicos.json",
            nameof(Paciente) => "pacientes.json",
            nameof(SalaParceira) => "salas.json",
            nameof(DisponibilidadeMedico) => "disponibilidades-medicos.json",
            nameof(DisponibilidadeSala) => "disponibilidades-salas.json",
            nameof(Consulta) => "consultas.json",
            nameof(ConversaPaciente) => "conversas-pacientes.json",
            _ => $"{typeof(T).Name.ToLowerInvariant()}.json"
        };
}
