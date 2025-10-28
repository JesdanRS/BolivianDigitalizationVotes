# Script para verificar y corregir la configuración del client

Write-Host "Verificando configuración del client..."

# Obtener token de administrador
$body = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
$tokenResponse = Invoke-RestMethod -Uri "http://localhost:8180/realms/master/protocol/openid-connect/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
$adminToken = $tokenResponse.access_token

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

# Obtener el client
Write-Host "Obteniendo información del client votaciones-client..."
try {
    $clients = Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/clients" -Headers $headers
    $client = $clients | Where-Object { $_.clientId -eq "votaciones-client" }
    
    if ($client) {
        Write-Host "Client encontrado: $($client.clientId)"
        Write-Host "ID: $($client.id)"
        Write-Host "Public Client: $($client.publicClient)"
        Write-Host "Direct Access Grants Enabled: $($client.directAccessGrantsEnabled)"
        
        # Actualizar el client para habilitar direct access grants
        $updateData = @{
            directAccessGrantsEnabled = $true
            publicClient = $true
            standardFlowEnabled = $true
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/clients/$($client.id)" -Method PUT -Body $updateData -Headers $headers
            Write-Host "✅ Client actualizado exitosamente"
        } catch {
            Write-Host "❌ Error actualizando client: $($_.Exception.Message)"
        }
    } else {
        Write-Host "❌ Client no encontrado"
    }
} catch {
    Write-Host "❌ Error obteniendo clients: $($_.Exception.Message)"
}

Write-Host "`nProbando autenticación nuevamente..."

$body = "client_id=votaciones-client&username=admin&password=admin123&grant_type=password"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8180/realms/votaciones-realm/protocol/openid-connect/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ Token obtenido exitosamente!"
    Write-Host "Token: $($response.access_token.Substring(0,50))..."
} catch {
    Write-Host "❌ Error obteniendo token: $($_.Exception.Message)"
}
