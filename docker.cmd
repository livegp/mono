@echo off
setlocal enabledelayedexpansion

REM Docker Compose Management Script
REM Usage: docker.cmd [dev|prod] [up|down|build|logs|ps]

if "%1"=="" (
    echo Usage: docker.cmd [dev^|prod] [up^|down^|build^|logs^|ps]
    echo.
    echo Examples:
    echo   docker.cmd dev up          - Start development environment
    echo   docker.cmd prod up -d      - Start production environment in background
    echo   docker.cmd dev down        - Stop development environment
    echo   docker.cmd dev build       - Build development images
    echo   docker.cmd dev logs        - Show development logs
    echo   docker.cmd prod ps         - Show production container status
    exit /b 1
)

set ENV=%1
set COMMAND=%2

if "%ENV%"=="dev" (
    set COMPOSE_FILES=-f docker-compose.yml -f docker-compose.dev.yml
    echo [DEV] Running development environment...
) else if "%ENV%"=="prod" (
    set COMPOSE_FILES=-f docker-compose.yml -f docker-compose.prod.yml
    if exist .env.prod (
        set COMPOSE_FILES=!COMPOSE_FILES! --env-file .env.prod
    ) else (
        echo Warning: .env.prod file not found. Using default values.
        echo Copy .env.prod.example to .env.prod and configure your production settings.
    )
    echo [PROD] Running production environment...
) else (
    echo Error: Environment must be 'dev' or 'prod'
    exit /b 1
)

REM Shift arguments to pass remaining args to docker-compose
shift
shift
set ARGS=
:loop
if "%1"=="" goto :execute
set ARGS=%ARGS% %1
shift
goto :loop

:execute
echo Executing: docker-compose %COMPOSE_FILES% %COMMAND% %ARGS%
docker-compose %COMPOSE_FILES% %COMMAND% %ARGS%
