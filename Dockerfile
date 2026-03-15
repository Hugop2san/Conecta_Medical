FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["conecta.medical1/conecta.medical1.csproj", "conecta.medical1/"]
RUN dotnet restore "conecta.medical1/conecta.medical1.csproj"

COPY . .
WORKDIR /src/conecta.medical1
RUN dotnet publish "conecta.medical1.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-10000} dotnet conecta.medical1.dll"]
