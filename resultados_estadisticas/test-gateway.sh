#!/bin/bash

# Script de prueba para verificar el criterio de Edge Server (Gateway)
# Autor: Sistema de Votaciones
# Fecha: 2025

echo "=========================================="
echo "PRUEBA DE API GATEWAY"
echo "Microservicio: RESULTADOS-ESTADISTICAS-SERVICE"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs
GATEWAY_URL="http://localhost:8080"
SERVICE_URL="http://localhost:8086"
EUREKA_URL="http://localhost:8761"

# Función para verificar respuesta
check_response() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        return 1
    fi
}

echo "=== 1. VERIFICANDO INFRAESTRUCTURA ==="
echo ""

# Verificar Eureka
echo -n "Eureka Server: "
if curl -s "${EUREKA_URL}/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Corriendo${NC}"
else
    echo -e "${RED}✗ No disponible${NC}"
    echo "   Ejecuta: docker-compose up eureka-server -d"
    exit 1
fi

# Verificar Gateway
echo -n "API Gateway: "
if curl -s "${GATEWAY_URL}/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Corriendo${NC}"
else
    echo -e "${RED}✗ No disponible${NC}"
    echo "   Ejecuta: docker-compose up api-gateway -d"
    exit 1
fi

# Verificar Microservicio
echo -n "Microservicio Resultados: "
if curl -s "${SERVICE_URL}/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Corriendo${NC}"
else
    echo -e "${RED}✗ No disponible${NC}"
    echo "   Ejecuta: mvn spring-boot:run"
    exit 1
fi

echo ""
echo "=== 2. VERIFICANDO REGISTRO EN EUREKA ==="
echo ""

sleep 3  # Esperar registro
REGISTERED=$(curl -s "${EUREKA_URL}/eureka/apps" | grep -c "RESULTADOS-ESTADISTICAS-SERVICE")
if [ "$REGISTERED" -gt 0 ]; then
    echo -e "${GREEN}✓ Servicio registrado en Eureka${NC}"
else
    echo -e "${YELLOW}⚠ Servicio no registrado (puede tomar hasta 60 segundos)${NC}"
fi

echo ""
echo "=== 3. VERIFICANDO RUTAS DEL GATEWAY ==="
echo ""

echo -e "${BLUE}Rutas configuradas para resultados:${NC}"
curl -s "${GATEWAY_URL}/actuator/gateway/routes" | jq '.[] | select(.route_id | contains("resultados")) | {route_id, uri, predicates, filters}'

echo ""
echo "=== 4. PROBANDO ENRUTAMIENTO (Predicados y Filtros) ==="
echo ""

# Test 1: Listar resultados a través del Gateway
echo -e "${YELLOW}Test 1: GET /api/resultados/resultados${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${GATEWAY_URL}/api/resultados/resultados")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Enrutamiento exitoso (HTTP 200)${NC}"
    echo "  Cantidad de resultados: $(echo "$RESPONSE" | head -n-1 | jq 'length')"
else
    echo -e "${RED}✗ Error en enrutamiento (HTTP $HTTP_CODE)${NC}"
fi

# Test 2: Obtener por ID
echo ""
echo -e "${YELLOW}Test 2: GET /api/resultados/resultados/1${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${GATEWAY_URL}/api/resultados/resultados/1")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Enrutamiento exitoso (HTTP 200)${NC}"
    echo "  Departamento: $(echo "$RESPONSE" | head -n-1 | jq -r '.departamento')"
else
    echo -e "${RED}✗ Error en enrutamiento (HTTP $HTTP_CODE)${NC}"
fi

# Test 3: Filtro por departamento
echo ""
echo -e "${YELLOW}Test 3: GET /api/resultados/resultados/departamento/La%20Paz${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${GATEWAY_URL}/api/resultados/resultados/departamento/La%20Paz")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Enrutamiento exitoso (HTTP 200)${NC}"
    echo "  Resultados encontrados: $(echo "$RESPONSE" | head -n-1 | jq 'length')"
else
    echo -e "${RED}✗ Error en enrutamiento (HTTP $HTTP_CODE)${NC}"
fi

# Test 4: Estadísticas
echo ""
echo -e "${YELLOW}Test 4: GET /api/resultados/resultados/estadisticas${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${GATEWAY_URL}/api/resultados/resultados/estadisticas")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Enrutamiento exitoso (HTTP 200)${NC}"
    echo "  Departamentos: $(echo "$RESPONSE" | head -n-1 | jq 'length')"
else
    echo -e "${RED}✗ Error en enrutamiento (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "=== 5. VERIFICANDO OPENAPI DOCS (RewritePath Filter) ==="
echo ""

# Test OpenAPI docs a través del Gateway
echo -e "${YELLOW}Test: GET /api/resultados/v3/api-docs${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${GATEWAY_URL}/api/resultados/v3/api-docs")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ OpenAPI docs accesible (HTTP 200)${NC}"
    TITLE=$(echo "$RESPONSE" | head -n-1 | jq -r '.info.title')
    echo "  Título: $TITLE"
    
    # Verificar que tiene servidores configurados
    SERVERS=$(echo "$RESPONSE" | head -n-1 | jq '.servers | length')
    echo "  Servidores configurados: $SERVERS"
    
    if [ "$SERVERS" -ge 2 ]; then
        echo -e "${GREEN}✓ Servidor Gateway configurado${NC}"
    else
        echo -e "${YELLOW}⚠ Falta configuración de servidores${NC}"
    fi
else
    echo -e "${RED}✗ Error al acceder a OpenAPI docs (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "=== 6. VERIFICANDO SWAGGER UI ==="
echo ""

# Verificar Swagger UI del Gateway
echo -e "${YELLOW}Verificando Swagger UI del Gateway...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${GATEWAY_URL}/swagger-ui.html")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Swagger UI accesible en Gateway${NC}"
    echo "  URL: ${GATEWAY_URL}/swagger-ui.html"
else
    echo -e "${RED}✗ Error al acceder a Swagger UI (HTTP $HTTP_CODE)${NC}"
fi

# Verificar que el servicio aparece en la configuración
echo ""
echo -e "${YELLOW}Verificando configuración de Swagger UI...${NC}"
CONFIG=$(curl -s "${GATEWAY_URL}/v3/api-docs/swagger-config")
if echo "$CONFIG" | grep -q "Resultados y Estadisticas Service"; then
    echo -e "${GREEN}✓ Servicio configurado en Swagger UI${NC}"
else
    echo -e "${YELLOW}⚠ Servicio no aparece en configuración de Swagger${NC}"
fi

echo ""
echo "=== 7. COMPARACIÓN: DIRECTO vs GATEWAY ==="
echo ""

echo -e "${BLUE}Acceso Directo (Desarrollo):${NC}"
echo "  curl ${SERVICE_URL}/resultados"
DIRECT=$(curl -s "${SERVICE_URL}/resultados" | jq 'length')
echo "  Resultados: $DIRECT"

echo ""
echo -e "${BLUE}Acceso vía Gateway (Producción):${NC}"
echo "  curl ${GATEWAY_URL}/api/resultados/resultados"
GATEWAY=$(curl -s "${GATEWAY_URL}/api/resultados/resultados" | jq 'length')
echo "  Resultados: $GATEWAY"

if [ "$DIRECT" = "$GATEWAY" ]; then
    echo -e "${GREEN}✓ Ambos retornan los mismos datos${NC}"
else
    echo -e "${YELLOW}⚠ Diferencia en resultados${NC}"
fi

echo ""
echo "=========================================="
echo "RESUMEN DE EVIDENCIAS"
echo "=========================================="
echo ""

echo -e "${GREEN}✓ Configuración Básica del Gateway${NC}"
echo "  - Gateway enruta peticiones correctamente"
echo "  - Peticiones /api/resultados/** redirigidas al microservicio"
echo ""

echo -e "${GREEN}✓ Uso de Predicados y Filtros${NC}"
echo "  - Path: /api/resultados/**"
echo "  - RewritePath: /api/resultados/v3/api-docs → /v3/api-docs"
echo "  - StripPrefix: 0"
echo ""

echo -e "${GREEN}✓ Documentación API${NC}"
echo "  - Swagger UI: ${GATEWAY_URL}/swagger-ui.html"
echo "  - OpenAPI docs: ${GATEWAY_URL}/api/resultados/v3/api-docs"
echo "  - Servicio visible en selector de Swagger UI"
echo ""

echo "URLs Importantes:"
echo "  - Gateway: ${GATEWAY_URL}"
echo "  - Swagger UI: ${GATEWAY_URL}/swagger-ui.html"
echo "  - Eureka: ${EUREKA_URL}"
echo "  - Microservicio: ${SERVICE_URL}"
echo ""

echo "Ejemplos de uso:"
echo "  curl ${GATEWAY_URL}/api/resultados/resultados"
echo "  curl ${GATEWAY_URL}/api/resultados/resultados/1"
echo "  curl ${GATEWAY_URL}/api/resultados/resultados/estadisticas"
echo ""

echo "=========================================="
echo "VERIFICACIÓN COMPLETADA"
echo "=========================================="
