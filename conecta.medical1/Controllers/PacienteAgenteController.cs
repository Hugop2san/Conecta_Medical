using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace conecta.medical1.Controllers;

[ApiController]
[Route("pacientes/agente")]
public class PacienteAgenteController(IConversaPacienteService conversaService) : ControllerBase
{
    [HttpPost("conversas")]
    public async Task<ActionResult<ConversaPacienteResponse>> CriarConversa(
        [FromBody] CriarConversaPacienteRequest request,
        CancellationToken ct)
    {
        var conversa = await conversaService.CriarMensagemPacienteAsync(request, ct);
        return Created($"/pacientes/agente/conversas/{conversa.ConversaId}", conversa);
    }

    [HttpPost("conversas/{conversaId:guid}/callback")]
    public async Task<ActionResult<ConversaPacienteResponse>> CallbackAgente(
        Guid conversaId,
        [FromBody] CallbackRespostaAgenteRequest request,
        CancellationToken ct)
        => Ok(await conversaService.RegistrarCallbackAgenteAsync(conversaId, request.Mensagem, ct));

    [HttpGet("conversas/{conversaId:guid}")]
    public async Task<ActionResult<ConversaPacienteResponse>> ObterConversa(Guid conversaId, CancellationToken ct)
    {
        var conversa = await conversaService.ObterPorIdAsync(conversaId, ct);
        return conversa is null ? NotFound() : Ok(conversa);
    }

    [HttpGet("paciente/{pacienteId:guid}/conversas")]
    public async Task<ActionResult<IReadOnlyList<ConversaPacienteResponse>>> ListarPorPaciente(Guid pacienteId, CancellationToken ct)
        => Ok(await conversaService.ListarPorPacienteAsync(pacienteId, ct));
}
