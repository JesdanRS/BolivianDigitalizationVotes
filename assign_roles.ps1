# Script para asignar roles a usuarios en Keycloak

Write-Host "Asignando roles a usuarios..."

# Obtener token de administrador
$body = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
$tokenResponse = Invoke-RestMethod -Uri "http://localhost:8180/realms/master/protocol/openid-connect/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
$adminToken = $tokenResponse.access_token

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

# Obtener usuarios
Write-Host "Obteniendo usuarios..."
$users = Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/users" -Headers $headers

# Obtener roles
Write-Host "Obteniendo roles..."
$roles = Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/roles" -Headers $headers

# Asignar rol ADMIN al usuario admin
$adminUser = $users | Where-Object { $_.username -eq "admin" }
$adminRole = $roles | Where-Object { $_.name -eq "ADMIN" }

if ($adminUser -and $adminRole) {
    $roleData = @($adminRole) | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/users/$($adminUser.id)/role-mappings/realm" -Method POST -Body $roleData -Headers $headers
        Write-Host "Rol ADMIN asignado al usuario admin exitosamente"
    } catch {
        Write-Host "Error asignando rol ADMIN: $($_.Exception.Message)"
    }
}

# Asignar rol USER al usuario user
$userUser = $users | Where-Object { $_.username -eq "user" }
$userRole = $roles | Where-Object { $_.name -eq "USER" }

if ($userUser -and $userRole) {
    $roleData = @($userRole) | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/users/$($userUser.id)/role-mappings/realm" -Method POST -Body $roleData -Headers $headers
        Write-Host "Rol USER asignado al usuario user exitosamente"
    } catch {
        Write-Host "Error asignando rol USER: $($_.Exception.Message)"
    }
}

Write-Host "Asignación de roles completada!"
