using System.Net;
using System.Text.Json;
using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;

namespace conecta.medical1.API;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (BusinessRuleException ex)
        {
            logger.LogWarning(ex, "Regra de negocio violada.");
            await WriteError(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "Erro de validacao.");
            await WriteError(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro interno.");
            await WriteError(context, HttpStatusCode.InternalServerError, "Erro interno do servidor.");
        }
    }

    private static async Task WriteError(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new ErrorResponse
        {
            Mensagem = message
        }, JsonOptions));
    }
}
