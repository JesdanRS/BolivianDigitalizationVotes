# Probar ambos usuarios

Write-Host "Probando usuario ADMIN..."
$body1 = "client_id=votaciones-client&username=admin&password=admin123&grant_type=password"
try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token" -Method POST -Body $body1 -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ ADMIN token: $($response1.access_token.Substring(0,50))..."
} catch {
    Write-Host "❌ Error ADMIN: $($_.Exception.Message)"
}

Write-Host "`nProbando usuario USER..."
$body2 = "client_id=votaciones-client&username=user&password=user123&grant_type=password"
try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token" -Method POST -Body $body2 -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ USER token: $($response2.access_token.Substring(0,50))..."
} catch {
    Write-Host "❌ Error USER: $($_.Exception.Message)"
}
