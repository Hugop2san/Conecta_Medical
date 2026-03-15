using conecta.medical1.API;
using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Services;
using conecta.medical1.Domain.Entities;
using conecta.medical1.Infrastructure.Repositories;
using conecta.medical1.Infrastructure.Seed;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

builder.Services.AddScoped(typeof(IRepository<>), typeof(JsonFileRepository<>));
builder.Services.AddScoped<IClock, SystemClock>();
builder.Services.AddScoped<IDataSeeder, JsonDataSeeder>();

builder.Services.AddScoped<ICrudService<Medico>, MedicoService>();
builder.Services.AddScoped<ICrudService<Paciente>, PacienteService>();
builder.Services.AddScoped<ICrudService<SalaParceira>, SalaParceiraService>();
builder.Services.AddScoped<ICrudService<DisponibilidadeMedico>, DisponibilidadeMedicoService>();
builder.Services.AddScoped<ICrudService<DisponibilidadeSala>, DisponibilidadeSalaService>();
builder.Services.AddScoped<IConsultaService, ConsultaService>();
builder.Services.AddScoped<IAgendaService, AgendaService>();
builder.Services.AddScoped<IPrecoService, PrecoService>();
builder.Services.AddScoped<IConversaPacienteService, ConversaPacienteService>();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<IDataSeeder>();
    await seeder.SeedAsync();
}

app.Run();
