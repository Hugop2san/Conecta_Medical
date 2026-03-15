using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("consultas")]
public class ConsultasController(IConsultaService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Consulta>>> Get(
        [FromQuery] Guid? medicoId,
        [FromQuery] Guid? pacienteId,
        [FromQuery] DateOnly? data,
        CancellationToken ct)
        => Ok(await service.ListarAsync(medicoId, pacienteId, data, ct));

    [HttpPost("agendar")]
    public async Task<ActionResult<Consulta>> Agendar([FromBody] AgendarConsultaRequest request, CancellationToken ct)
    {
        var consulta = await service.AgendarAsync(request, ct);
        return Created($"/consultas/{consulta.Id}", consulta);
    }

    [HttpPost("{id:guid}/confirmar")]
    public async Task<ActionResult<Consulta>> Confirmar(
        Guid id,
        [FromBody] ConfirmarConsultaRequest request,
        CancellationToken ct)
        => Ok(await service.ConfirmarAsync(id, request.CodigoConfirmacao, ct));

    [HttpPost("{id:guid}/cancelar")]
    public async Task<ActionResult<Consulta>> Cancelar(
        Guid id,
        [FromBody] CancelarConsultaRequest request,
        CancellationToken ct)
        => Ok(await service.CancelarAsync(id, request.Motivo, ct));
}
