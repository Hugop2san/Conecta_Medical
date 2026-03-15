using conecta.medical1.Application.Contracts;
using conecta.medical1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("salas")]
public class SalasController(ICrudService<SalaParceira> service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SalaParceira>>> GetAll(CancellationToken ct)
        => Ok(await service.GetAllAsync(ct));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SalaParceira>> GetById(Guid id, CancellationToken ct)
    {
        var sala = await service.GetByIdAsync(id, ct);
        return sala is null ? NotFound() : Ok(sala);
    }

    [HttpPost]
    public async Task<ActionResult<SalaParceira>> Create([FromBody] SalaParceira sala, CancellationToken ct)
    {
        var created = await service.CreateAsync(sala, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SalaParceira>> Update(Guid id, [FromBody] SalaParceira sala, CancellationToken ct)
        => Ok(await service.UpdateAsync(id, sala, ct));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return NoContent();
    }
}
