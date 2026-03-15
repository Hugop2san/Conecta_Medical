using conecta.medical1.Application.Contracts;
using conecta.medical1.Application.Dtos;
using conecta.medical1.Application.Services;
using conecta.medical1.Domain.Entities;
using conecta.medical1.Domain.Enums;

namespace conecta.medical1.Tests;

public class ConsultaServiceTests
{
    [Fact]
    public async Task DeveBloquearConflitoDeHorario()
    {
        var fixture = BuildFixture();

        await fixture.Service.AgendarAsync(new AgendarConsultaRequest
        {
            PacienteId = fixture.PacienteA.Id,
            MedicoId = fixture.Medico.Id,
            SalaParceiraId = fixture.Sala.Id,
            Data = fixture.DataBase,
            HoraInicio = new TimeOnly(9, 0),
            HoraFim = new TimeOnly(9, 30),
            Modalidade = ModalidadeConsulta.Presencial
        });

        var action = () => fixture.Service.AgendarAsync(new AgendarConsultaRequest
        {
            PacienteId = fixture.PacienteB.Id,
            MedicoId = fixture.Medico.Id,
            SalaParceiraId = fixture.Sala.Id,
            Data = fixture.DataBase,
            HoraInicio = new TimeOnly(9, 15),
            HoraFim = new TimeOnly(9, 45),
            Modalidade = ModalidadeConsulta.Presencial
        });

        var ex = await Assert.ThrowsAsync<BusinessRuleException>(action);
        Assert.Equal("Conflito de horario para medico.", ex.Message);
    }

    [Fact]
    public async Task DeveAgendarConsultaPresencialValida()
    {
        var fixture = BuildFixture();

        var consulta = await fixture.Service.AgendarAsync(new AgendarConsultaRequest
        {
            PacienteId = fixture.PacienteA.Id,
            MedicoId = fixture.Medico.Id,
            SalaParceiraId = fixture.Sala.Id,
            Data = fixture.DataBase,
            HoraInicio = new TimeOnly(10, 0),
            HoraFim = new TimeOnly(10, 30),
            Modalidade = ModalidadeConsulta.Presencial
        });

        Assert.Equal(StatusConsulta.Pendente, consulta.Status);
        Assert.False(string.IsNullOrWhiteSpace(consulta.CodigoConfirmacao));
        Assert.Equal(fixture.Sala.Id, consulta.SalaParceiraId);
    }

    [Fact]
    public async Task DevePermitirConsultaOnlineSemSala()
    {
        var fixture = BuildFixture();

        var consulta = await fixture.Service.AgendarAsync(new AgendarConsultaRequest
        {
            PacienteId = fixture.PacienteA.Id,
            MedicoId = fixture.Medico.Id,
            Data = fixture.DataBase,
            HoraInicio = new TimeOnly(14, 0),
            HoraFim = new TimeOnly(14, 30),
            Modalidade = ModalidadeConsulta.Online
        });

        Assert.Null(consulta.SalaParceiraId);
        Assert.Equal(StatusConsulta.Pendente, consulta.Status);
    }

    [Fact]
    public async Task DeveBloquearQuandoSalaIndisponivel()
    {
        var fixture = BuildFixture();

        var action = () => fixture.Service.AgendarAsync(new AgendarConsultaRequest
        {
            PacienteId = fixture.PacienteA.Id,
            MedicoId = fixture.Medico.Id,
            SalaParceiraId = fixture.Sala.Id,
            Data = fixture.DataBase,
            HoraInicio = new TimeOnly(12, 30),
            HoraFim = new TimeOnly(13, 0),
            Modalidade = ModalidadeConsulta.Presencial
        });

        var ex = await Assert.ThrowsAsync<BusinessRuleException>(action);
        Assert.Equal("Sala indisponivel no intervalo solicitado.", ex.Message);
    }

    private static Fixture BuildFixture()
    {
        var data = new DateOnly(2026, 3, 20);
        var medico = new Medico
        {
            Id = Guid.Parse("ea2a0e1a-c2e1-421e-97ca-8e4306d95c6f"),
            Nome = "Dr. Marcelo",
            Crm = "123456-SP",
            Especialidade = "Clinica Geral",
            PrecoConsultaHora = 200,
            Ativo = true
        };
        var pacienteA = new Paciente { Id = Guid.NewGuid(), Nome = "Ana", Cpf = "11122233344" };
        var pacienteB = new Paciente { Id = Guid.NewGuid(), Nome = "Bruno", Cpf = "55566677788" };
        var sala = new SalaParceira
        {
            Id = Guid.Parse("87f94634-6d28-4d44-9446-9f17b5145d21"),
            NomeSala = "Sala Paulista 01",
            PrecoAluguelHora = 80,
            Ativa = true
        };

        var medicoDisponibilidades = new[]
        {
            new DisponibilidadeMedico
            {
                Id = Guid.NewGuid(),
                MedicoId = medico.Id,
                Data = data,
                HoraInicio = new TimeOnly(9, 0),
                HoraFim = new TimeOnly(13, 0),
                Modalidade = ModalidadeConsulta.Presencial
            },
            new DisponibilidadeMedico
            {
                Id = Guid.NewGuid(),
                MedicoId = medico.Id,
                Data = data,
                HoraInicio = new TimeOnly(14, 0),
                HoraFim = new TimeOnly(16, 0),
                Modalidade = ModalidadeConsulta.Online
            }
        };

        var salaDisponibilidades = new[]
        {
            new DisponibilidadeSala
            {
                Id = Guid.NewGuid(),
                SalaParceiraId = sala.Id,
                Data = data,
                HoraInicio = new TimeOnly(9, 0),
                HoraFim = new TimeOnly(12, 0),
                PrecoSala = 80,
                Ativa = true
            }
        };

        var consultaRepository = new InMemoryRepository<Consulta>();
        var service = new ConsultaService(
            consultaRepository,
            new InMemoryRepository<Medico>([medico]),
            new InMemoryRepository<Paciente>([pacienteA, pacienteB]),
            new InMemoryRepository<SalaParceira>([sala]),
            new InMemoryRepository<DisponibilidadeMedico>(medicoDisponibilidades),
            new InMemoryRepository<DisponibilidadeSala>(salaDisponibilidades),
            new FakeClock(new DateTime(2026, 3, 15, 15, 0, 0, DateTimeKind.Utc)));

        return new Fixture
        {
            Service = service,
            DataBase = data,
            Medico = medico,
            PacienteA = pacienteA,
            PacienteB = pacienteB,
            Sala = sala
        };
    }

    private class Fixture
    {
        public required ConsultaService Service { get; init; }
        public required DateOnly DataBase { get; init; }
        public required Medico Medico { get; init; }
        public required Paciente PacienteA { get; init; }
        public required Paciente PacienteB { get; init; }
        public required SalaParceira Sala { get; init; }
    }
}
