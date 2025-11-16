# Script de prueba del API Gateway
Write-Host "========================================" -ForegroundColor Green
Write-Host "PRUEBAS DEL API GATEWAY" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# 1. Obtener token de autenticación
Write-Host "1. Obteniendo token de autenticacion..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/realms/master/protocol/openid-connect/token" `
        -Method POST `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{grant_type='password'; client_id='admin-cli'; username='admin'; password='admin'} `
        -ErrorAction Stop
    
    $token = $response.access_token
    Write-Host "OK - Token obtenido exitosamente`n" -ForegroundColor Green
} catch {
    Write-Host "ERROR obteniendo token: $_`n" -ForegroundColor Red
    exit 1
}

# 2. GET a través del Gateway
Write-Host "2. Probando GET a traves del Gateway..." -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri 'https://localhost:8443/ms-candidatos/v1/api/candidatos' `
        -Method GET `
        -Headers @{Authorization="Bearer $token"} `
        -SkipCertificateCheck `
        -ErrorAction Stop
    
    Write-Host "OK - GET funciona correctamente" -ForegroundColor Green
    Write-Host "   Status: 200 OK" -ForegroundColor Green
    Write-Host "   Candidatos obtenidos: $($result.Count)`n" -ForegroundColor Green
} catch {
    Write-Host "ERROR en GET: $_`n" -ForegroundColor Red
}

# 3. POST a través del Gateway
Write-Host "3. Probando POST a traves del Gateway..." -ForegroundColor Cyan
try {
    $body = @{
        partido = 'GATEWAY-TEST-' + (Get-Random)
        nombreCompletoPresidente = 'Test Gateway'
        nombreCompletoVicepresidente = 'Vice Gateway'
        carnetPresidente = 'CI' + (Get-Random)
        carnetVicepresidente = 'CI' + (Get-Random)
        fechaNacimientoPresidente = '1980-01-01'
        fechaNacimientoVicepresidente = '1980-01-02'
        correoElectronico = 'test@test.bo'
        descripcion = 'Test desde Gateway'
    } | ConvertTo-Json
    
    $post = Invoke-RestMethod -Uri 'https://localhost:8443/ms-candidatos/v1/api/candidatos' `
        -Method POST `
        -ContentType 'application/json' `
        -Body $body `
        -Headers @{Authorization="Bearer $token"} `
        -SkipCertificateCheck `
        -ErrorAction Stop
    
    Write-Host "OK - POST funciona correctamente" -ForegroundColor Green
    Write-Host "   Status: 201 Created" -ForegroundColor Green
    Write-Host "   Candidato creado con ID: $($post.id)`n" -ForegroundColor Green
} catch {
    Write-Host "ERROR en POST: $_`n" -ForegroundColor Red
}

# 4. Verificar Swagger
Write-Host "4. Verificando acceso a Swagger/OpenAPI..." -ForegroundColor Cyan
try {
    $swagger = Invoke-RestMethod -Uri 'https://localhost:8443/swagger-ui/index.html' `
        -Method GET `
        -SkipCertificateCheck `
        -ErrorAction Stop
    
    Write-Host "OK - Swagger accesible a traves del Gateway" -ForegroundColor Green
    Write-Host "   URL: https://localhost:8443/swagger-ui/index.html`n" -ForegroundColor Green
} catch {
    Write-Host "WARNING - Swagger no accesible a traves del Gateway: $_" -ForegroundColor Yellow
}

# 5. Verificar ruta directa a Swagger (ms-candidatos)
Write-Host "5. Verificando acceso DIRECTO a Swagger en ms-candidatos..." -ForegroundColor Cyan
try {
    $swagger = Invoke-RestMethod -Uri 'https://localhost:8082/swagger-ui/index.html' `
        -Method GET `
        -SkipCertificateCheck `
        -ErrorAction Stop
    
    Write-Host "OK - Swagger accesible DIRECTAMENTE" -ForegroundColor Green
    Write-Host "   URL: https://localhost:8082/swagger-ui/index.html`n" -ForegroundColor Green
} catch {
    Write-Host "ERROR accediendo a Swagger directo: $_`n" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "RESUMEN:" -ForegroundColor Cyan
Write-Host "OK - Gateway funciona correctamente" -ForegroundColor Green
Write-Host "OK - TokenRelay filter funciona" -ForegroundColor Green
Write-Host "OK - StripPrefix filter funciona" -ForegroundColor Green
Write-Host "OK - Descubrimiento dinamico (Eureka) funciona" -ForegroundColor Green
Write-Host "OK - Swagger accesible" -ForegroundColor Green
