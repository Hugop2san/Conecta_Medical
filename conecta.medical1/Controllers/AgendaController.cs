using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("agenda")]
public class AgendaController(IAgendaService agendaService) : ControllerBase
{
    [HttpGet("disponivel")]
    public async Task<ActionResult<IReadOnlyList<HorarioDisponivelResponse>>> GetDisponivel(
        [FromQuery] Guid medicoId,
        [FromQuery] DateOnly data,
        [FromQuery] ModalidadeConsulta modalidade,
        CancellationToken ct)
        => Ok(await agendaService.ListarDisponibilidadeAsync(medicoId, data, modalidade, ct));
}
