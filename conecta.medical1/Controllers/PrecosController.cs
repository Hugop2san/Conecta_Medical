using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("precos")]
public class PrecosController(IPrecoService precoService) : ControllerBase
{
    [HttpGet("medicos")]
    public async Task<ActionResult<IReadOnlyList<Medico>>> GetPrecosMedicos(CancellationToken ct)
        => Ok(await precoService.ListarPrecosMedicosAsync(ct));

    [HttpGet("somatorio")]
    public async Task<ActionResult<SomatorioPrecoResponse>> Somatorio(
        [FromQuery] Guid medicoId,
        [FromQuery] Guid? salaParceiraId,
        CancellationToken ct)
        => Ok(await precoService.SomarPrecoMedicoSalaAsync(medicoId, salaParceiraId, ct));
}
