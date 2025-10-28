# Script simple para probar autenticación con Keycloak

Write-Host "Probando autenticación con Keycloak..."

$body = "client_id=votaciones-client&username=admin&password=admin123&grant_type=password"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ Token obtenido exitosamente!"
    Write-Host "Token: $($response.access_token.Substring(0,50))..."
    Write-Host "Tipo: $($response.token_type)"
    Write-Host "Expira en: $($response.expires_in) segundos"
} catch {
    Write-Host "❌ Error obteniendo token: $($_.Exception.Message)"
    Write-Host "Detalles: $($_.Exception.Response.StatusCode)"
}

Write-Host "`nProbando con usuario USER..."

$body2 = "client_id=votaciones-client&username=user&password=user123&grant_type=password"

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token" -Method POST -Body $body2 -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ Token USER obtenido exitosamente!"
    Write-Host "Token: $($response2.access_token.Substring(0,50))..."
} catch {
    Write-Host "❌ Error obteniendo token USER: $($_.Exception.Message)"
}
