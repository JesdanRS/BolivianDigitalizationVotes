@echo off
REM Script para obtener token de Keycloak - Windows

echo ========================================
echo Verificar Token de Keycloak
echo ========================================
echo.

REM Solicitar el Client Secret
echo Abre Keycloak Admin:
echo   - Ve a: Candidatos-demo > Clients > candidatos-app > Credentials
echo   - Copia el Client secret
echo.

set /p CLIENT_SECRET="Pega el Client Secret: "

if "%CLIENT_SECRET%"=="" (
    echo ERROR: Client Secret no puede estar vacío
    pause
    exit /b 1
)

echo.
echo ========================================
echo Opción 1: Obtener token con Client Credentials
echo ========================================
echo.

curl -X POST http://localhost:8888/realms/Candidatos-demo/protocol/openid-connect/token ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "client_id=candidatos-app" ^
  -d "client_secret=%CLIENT_SECRET%" ^
  -d "grant_type=client_credentials"

echo.
echo.
echo ========================================
echo Opción 2: Obtener token con Usuario (admin1)
echo ========================================
echo.

set /p PASSWORD="Ingresa la contraseña de admin1: "

if "%PASSWORD%"=="" (
    echo ERROR: Contraseña no puede estar vacía
    pause
    exit /b 1
)

echo.
echo Obteniendo token para admin1...
echo.

curl -X POST http://localhost:8888/realms/Candidatos-demo/protocol/openid-connect/token ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "client_id=candidatos-app" ^
  -d "client_secret=%CLIENT_SECRET%" ^
  -d "grant_type=password" ^
  -d "username=admin1" ^
  -d "password=%PASSWORD%"

echo.
echo.
echo ========================================
echo ✅ Si ves "access_token" arriba, ¡FUNCIONA!
echo ========================================
echo.
pause
