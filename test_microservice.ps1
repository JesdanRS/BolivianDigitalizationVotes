# Probar el microservicio con token de Keycloak

Write-Host "Obteniendo token de ADMIN..."
$body = "client_id=votaciones-client&username=admin&password=admin123&grant_type=password"
$response = Invoke-RestMethod -Uri "http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
$token = $response.access_token

Write-Host "Token obtenido: $($token.Substring(0,50))..."

Write-Host "`nProbando endpoint protegido con token..."
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $result = Invoke-RestMethod -Uri "http://localhost:8080/ms-resultados/api/resultados" -Method GET -Headers $headers
    Write-Host "✅ Endpoint protegido funcionando!"
    Write-Host "Resultados obtenidos: $($result.Count) registros"
} catch {
    Write-Host "❌ Error en endpoint protegido: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
}

Write-Host "`nProbando endpoint sin token..."
try {
    $result2 = Invoke-RestMethod -Uri "http://localhost:8080/ms-resultados/api/resultados" -Method GET
    Write-Host "❌ Error: endpoint debería requerir token"
} catch {
    Write-Host "✅ Correcto: endpoint rechaza peticiones sin token"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
}
