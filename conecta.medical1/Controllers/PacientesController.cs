using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("pacientes")]
public class PacientesController(ICrudService<Paciente> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Paciente>>> GetAll(CancellationToken ct)
        => Ok(await service.GetAllAsync(ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Paciente>> GetById(Guid id, CancellationToken ct)
    {
        var paciente = await service.GetByIdAsync(id, ct);
        return paciente is null ? NotFound() : Ok(paciente);
    }

    [HttpPost]
    public async Task<ActionResult<Paciente>> Create([FromBody] Paciente paciente, CancellationToken ct)
    {
        var created = await service.CreateAsync(paciente, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Paciente>> Update(Guid id, [FromBody] Paciente paciente, CancellationToken ct)
        => Ok(await service.UpdateAsync(id, paciente, ct));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return NoContent();
    }
}
