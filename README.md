# Conecta Medical MVP API

Web API ASP.NET Core (.NET 8) para MVP de agendamento de Clinica Geral com:
- cadastro de medicos, pacientes e salas parceiras
- disponibilidade de medico e sala
- agendamento por intersecao de disponibilidade
- bloqueio de conflitos (medico, paciente e sala)
- persistencia local em arquivos JSON
- seed automatico idempotente para salas e disponibilidades de sala

## Estrutura

O projeto Conecta Medical está dividido em duas partes principais:

### Frontend
Interface da plataforma onde pacientes e médicos interagem com o sistema.

➡️ Acesse o frontend aqui:  
https://github.com/Hugop2san/Conecta_Medical/tree/frontend

### Backend

- `conecta.medical1/Domain`: entidades e enums
- `conecta.medical1/Application`: contratos, DTOs e servicos de negocio
- `conecta.medical1/Infrastructure`: repositorio JSON e seed
- `conecta.medical1/Controllers`: endpoints da API
- `conecta.medical1/Data`: armazenamento local JSON
- `conecta.medical1/SeedData`: arquivos de seed inicial
- `conecta.medical1.Tests`: testes xUnit de regras de agendamento


## Executar

```bash
dotnet restore
dotnet run --project conecta.medical1/conecta.medical1.csproj
```

Swagger: `https://localhost:xxxx/swagger` (porta exibida no console).

## Seed automatico

Na inicializacao, a API executa `JsonDataSeeder`:
- le `SeedData/salas.seed.json`
- le `SeedData/disponibilidades-salas.seed.json`
- adiciona apenas itens cujo `Id` ainda nao existe (nao duplica dados)

## Endpoints principais

### CRUD

- `GET /medicos`
- `GET /medicos/{id}`
- `POST /medicos`
- `PUT /medicos/{id}`
- `DELETE /medicos/{id}`

- `GET /pacientes`
- `GET /pacientes/{id}`
- `POST /pacientes`
- `PUT /pacientes/{id}`
- `DELETE /pacientes/{id}`

- `GET /salas`
- `GET /salas/{id}`
- `POST /salas`
- `PUT /salas/{id}`
- `DELETE /salas/{id}`

### Disponibilidades

- `POST /disponibilidades/medicos`
- `POST /disponibilidades/salas`

### Agenda e consultas

- `GET /agenda/disponivel?medicoId={id}&data=2026-03-20&modalidade=Presencial`
- `POST /consultas/agendar`
- `POST /consultas/{id}/confirmar`
- `POST /consultas/{id}/cancelar`
- `GET /consultas?medicoId={id}&pacienteId={id}&data=2026-03-20`

### Precos

- `GET /precos/medicos`
- `GET /precos/somatorio?medicoId={id}&salaParceiraId={id}`

### Conversa paciente <-> agente (n8n)

- `POST /pacientes/agente/conversas`
- `POST /pacientes/agente/conversas/{conversaId}/callback`
- `GET /pacientes/agente/conversas/{conversaId}`
- `GET /pacientes/agente/paciente/{pacienteId}/conversas`

### Endpoints para consumo do agente (medicos + precos)

- `GET /agente/catalogo/medicos-precos`
- `GET /agente/catalogo/somatorio?medicoId={id}&salaParceiraId={id}`

## Exemplos de requests/responses

### 1) Criar medico

`POST /medicos`

```json
{
  "nome": "Dr. Joao Silva",
  "crm": "123456-SP",
  "especialidade": "Clinica Geral",
  "precoConsultaHora": 180.0,
  "atendimentosPorHora": 2,
  "ativo": true
}
```

Resposta `201 Created`:

```json
{
  "id": "f4df31c0-00bc-4ecf-bd20-7ff1c4f26a0a",
  "nome": "Dr. Joao Silva",
  "crm": "123456-SP",
  "especialidade": "Clinica Geral",
  "precoConsultaHora": 180,
  "atendimentosPorHora": 2,
  "ativo": true
}
```

### 2) Disponibilidade de medico

`POST /disponibilidades/medicos`

```json
{
  "medicoId": "f4df31c0-00bc-4ecf-bd20-7ff1c4f26a0a",
  "data": "2026-03-20",
  "horaInicio": "09:00:00",
  "horaFim": "12:00:00",
  "modalidade": "Presencial"
}
```

### 3) Agendar consulta presencial

`POST /consultas/agendar`

```json
{
  "pacienteId": "d5622e65-1e00-4e88-ac01-028f877f97a1",
  "medicoId": "f4df31c0-00bc-4ecf-bd20-7ff1c4f26a0a",
  "salaParceiraId": "87f94634-6d28-4d44-9446-9f17b5145d21",
  "data": "2026-03-20",
  "horaInicio": "09:00:00",
  "horaFim": "09:30:00",
  "modalidade": "Presencial"
}
```

Resposta `201 Created`:

```json
{
  "id": "7ee7c7c7-e764-44a9-8898-cf9969024998",
  "pacienteId": "d5622e65-1e00-4e88-ac01-028f877f97a1",
  "medicoId": "f4df31c0-00bc-4ecf-bd20-7ff1c4f26a0a",
  "salaParceiraId": "87f94634-6d28-4d44-9446-9f17b5145d21",
  "data": "2026-03-20",
  "horaInicio": "09:00:00",
  "horaFim": "09:30:00",
  "status": "Pendente",
  "codigoConfirmacao": "9A10B3CD",
  "precoConsulta": 180,
  "motivoCancelamento": null,
  "expiraEmUtc": "2026-03-15T18:20:00Z"
}
```

### 4) Confirmar consulta por codigo

`POST /consultas/{id}/confirmar`

```json
{
  "codigoConfirmacao": "9A10B3CD"
}
```

Regra: se passar de 2 minutos sem confirmacao, a API cancela e retorna:

```json
{
  "mensagem": "medico nao aceitou no tempo limite"
}
```

### 5) Cancelar consulta

`POST /consultas/{id}/cancelar`

```json
{
  "motivo": "Paciente nao pode comparecer"
}
```

### 6) Enviar mensagem do paciente para o agente (n8n)

`POST /pacientes/agente/conversas`

```json
{
  "pacienteId": "d5622e65-1e00-4e88-ac01-028f877f97a1",
  "nomePaciente": "Ana Souza",
  "telefonePaciente": "11999990000",
  "emailPaciente": "ana@email.com",
  "bairro": "Tatuape",
  "cidade": "Sao Paulo",
  "orcamentoMaximo": 220.0,
  "mensagem": "Quero consulta com preco ate 220 reais."
}
```

### 7) Callback do agente/webhook com resposta para o paciente

`POST /pacientes/agente/conversas/{conversaId}/callback`

```json
{
  "mensagem": "Melhor opcao: Dr. Carlos, 180/hora."
}
```

## Regras implementadas

- consulta so e criada se medico estiver disponivel no intervalo
- consulta presencial exige sala ativa e disponivel
- consulta online nao exige sala
- bloqueio de double booking para medico, paciente e sala
- codigo de confirmacao gerado no agendamento
- confirmacao exige codigo valido e dentro do prazo de 2 minutos
- mensagens de erro padronizadas: `{"mensagem":"..."}`

## Testes

```bash
dotnet test conecta.medical1.sln
```

Cobertura minima implementada:
- conflito de horario
- agendamento valido
- consulta online sem sala
- bloqueio quando sala indisponivel
