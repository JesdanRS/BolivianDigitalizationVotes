#!/bin/bash

echo "=========================================="
echo "🔍 VERIFICACIÓN DE KEYCLOAK Y SERVICIOS"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar servicio
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Verificando $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302\|401"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO${NC}"
        return 1
    fi
}

echo "1️⃣  Verificando contenedores Docker..."
echo "----------------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "keycloak|ms-resultados|eureka|api-gateway|bd-resultados"
echo ""

echo "2️⃣  Verificando servicios..."
echo "----------------------------------------"
check_service "Keycloak" "http://localhost:8180/auth"
check_service "Eureka Server" "http://localhost:8761"
check_service "API Gateway" "http://localhost:8080/actuator/health"
check_service "Resultados Service" "http://localhost:8080/ms-resultados/actuator/health"
echo ""

echo "3️⃣  Probando obtener token de Keycloak..."
echo "----------------------------------------"
TOKEN_RESPONSE=$(curl -s -X POST \
  "http://localhost:8180/auth/realms/votaciones-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=votaciones-client" \
  -d "username=admin" \
  -d "password=admin123" \
  -d "grant_type=password")

if echo "$TOKEN_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Token obtenido exitosamente${NC}"
    ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "Token (primeros 50 caracteres): ${ACCESS_TOKEN:0:50}..."
    echo ""
    
    echo "4️⃣  Probando endpoint protegido..."
    echo "----------------------------------------"
    ENDPOINT_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      "http://localhost:8080/ms-resultados/api/resultados")
    
    HTTP_CODE=$(echo "$ENDPOINT_RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Endpoint respondió correctamente (200 OK)${NC}"
        echo "Datos recibidos:"
        echo "$ENDPOINT_RESPONSE" | sed '/HTTP_CODE/d' | head -n 10
    else
        echo -e "${RED}❌ Endpoint falló (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "${RED}❌ No se pudo obtener el token${NC}"
    echo "Respuesta de Keycloak:"
    echo "$TOKEN_RESPONSE"
fi

echo ""
echo "=========================================="
echo "📊 RESUMEN"
echo "=========================================="
echo "URLs importantes:"
echo "  🔐 Keycloak Admin: http://localhost:8180/auth"
echo "  🌐 API Gateway: http://localhost:8080"
echo "  📡 Eureka: http://localhost:8761"
echo "  📚 Swagger: http://localhost:8080/ms-resultados/swagger-ui.html"
echo ""
echo "Credenciales:"
echo "  👤 Admin: admin / admin123"
echo "  👤 User: user / user123"
echo ""
echo "=========================================="
