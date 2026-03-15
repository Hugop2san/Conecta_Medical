using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Application.Services;

public static class ConsultaStatusHelper
{
    public static bool OcupaAgenda(StatusConsulta status)
        => status is StatusConsulta.Pendente or StatusConsulta.Confirmada;
}
