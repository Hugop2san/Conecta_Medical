using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("medicos")]
public class MedicosController(ICrudService<Medico> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Medico>>> GetAll(CancellationToken ct)
        => Ok(await service.GetAllAsync(ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Medico>> GetById(Guid id, CancellationToken ct)
    {
        var medico = await service.GetByIdAsync(id, ct);
        return medico is null ? NotFound() : Ok(medico);
    }

    [HttpPost]
    public async Task<ActionResult<Medico>> Create([FromBody] Medico medico, CancellationToken ct)
    {
        var created = await service.CreateAsync(medico, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Medico>> Update(Guid id, [FromBody] Medico medico, CancellationToken ct)
        => Ok(await service.UpdateAsync(id, medico, ct));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return NoContent();
    }
}
