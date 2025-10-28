# Script para configurar Keycloak con el realm de votaciones

Write-Host "Configurando Keycloak..."

# Paso 1: Obtener token de administrador
Write-Host "Obteniendo token de administrador..."
$body = "username=admin&password=admin&grant_type=password&client_id=admin-cli"

try {
    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:8180/realms/master/protocol/openid-connect/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    $adminToken = $tokenResponse.access_token
    Write-Host "Token obtenido exitosamente"
} catch {
    Write-Host "Error obteniendo token: $($_.Exception.Message)"
    exit 1
}

# Paso 2: Crear el realm votaciones-realm
Write-Host "Creando realm votaciones-realm..."
$realmData = @{
    realm = "votaciones-realm"
    displayName = "Sistema de Votaciones"
    enabled = $true
    loginWithEmailAllowed = $false
    duplicateEmailsAllowed = $false
    resetPasswordAllowed = $true
    editUsernameAllowed = $false
    bruteForceProtected = $true
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

try {
    Invoke-RestMethod -Uri "http://localhost:8180/admin/realms" -Method POST -Body $realmData -Headers $headers
    Write-Host "Realm creado exitosamente"
} catch {
    Write-Host "Error creando realm: $($_.Exception.Message)"
}

# Paso 3: Crear el client votaciones-client
Write-Host "Creando client votaciones-client..."
$clientData = @{
    clientId = "votaciones-client"
    name = "Votaciones Client"
    description = "Cliente para el sistema de votaciones"
    enabled = $true
    clientAuthenticatorType = "client-secret"
    secret = "votaciones-secret"
    standardFlowEnabled = $true
    implicitFlowEnabled = $false
    directAccessGrantsEnabled = $true
    serviceAccountsEnabled = $false
    publicClient = $false
    protocol = "openid-connect"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/clients" -Method POST -Body $clientData -Headers $headers
    Write-Host "Client creado exitosamente"
} catch {
    Write-Host "Error creando client: $($_.Exception.Message)"
}

# Paso 4: Crear roles
Write-Host "Creando roles..."
$roles = @("ADMIN", "USER")
foreach ($role in $roles) {
    $roleData = @{
        name = $role
        description = "Rol $role para el sistema de votaciones"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/roles" -Method POST -Body $roleData -Headers $headers
        Write-Host "Rol $role creado exitosamente"
    } catch {
        Write-Host "Error creando rol $role : $($_.Exception.Message)"
    }
}

# Paso 5: Crear usuarios
Write-Host "Creando usuarios..."

# Usuario admin
$adminUserData = @{
    username = "admin"
    email = "admin@votaciones.bo"
    firstName = "Administrador"
    lastName = "Sistema"
    enabled = $true
    credentials = @(
        @{
            type = "password"
            value = "admin123"
            temporary = $false
        }
    )
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/users" -Method POST -Body $adminUserData -Headers $headers
    Write-Host "Usuario admin creado exitosamente"
} catch {
    Write-Host "Error creando usuario admin: $($_.Exception.Message)"
}

# Usuario user
$userData = @{
    username = "user"
    email = "user@votaciones.bo"
    firstName = "Usuario"
    lastName = "Sistema"
    enabled = $true
    credentials = @(
        @{
            type = "password"
            value = "user123"
            temporary = $false
        }
    )
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8180/admin/realms/votaciones-realm/users" -Method POST -Body $userData -Headers $headers
    Write-Host "Usuario user creado exitosamente"
} catch {
    Write-Host "Error creando usuario user: $($_.Exception.Message)"
}

Write-Host "Configuración de Keycloak completada!"
Write-Host "Puedes acceder a Keycloak en: http://localhost:8180"
Write-Host "Usuario admin: admin / admin123"
Write-Host "Usuario user: user / user123"
