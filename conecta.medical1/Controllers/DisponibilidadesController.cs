using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("disponibilidades")]
public class DisponibilidadesController(
    ICrudService<DisponibilidadeMedico> disponibilidadeMedicoService,
    ICrudService<DisponibilidadeSala> disponibilidadeSalaService) : ControllerBase
{
    [HttpPost("medicos")]
    public async Task<ActionResult<DisponibilidadeMedico>> CreateMedico(
        [FromBody] DisponibilidadeMedico disponibilidade,
        CancellationToken ct)
    {
        var created = await disponibilidadeMedicoService.CreateAsync(disponibilidade, ct);
        return Created($"/disponibilidades/medicos/{created.Id}", created);
    }

    [HttpPost("salas")]
    public async Task<ActionResult<DisponibilidadeSala>> CreateSala(
        [FromBody] DisponibilidadeSala disponibilidade,
        CancellationToken ct)
    {
        var created = await disponibilidadeSalaService.CreateAsync(disponibilidade, ct);
        return Created($"/disponibilidades/salas/{created.Id}", created);
    }
}
