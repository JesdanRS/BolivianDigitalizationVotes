#!/bin/bash

# Script de prueba para verificar el criterio de Eureka Discovery
# Autor: Sistema de Votaciones
# Fecha: 2025

echo "=========================================="
echo "PRUEBA DE EUREKA DISCOVERY"
echo "Microservicio: RESULTADOS-ESTADISTICAS-SERVICE"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs
EUREKA_URL="http://localhost:8761"
SERVICE_URL="http://localhost:8086"

echo "1. Verificando Eureka Server..."
if curl -s "${EUREKA_URL}/actuator/health" > /dev/null; then
    echo -e "${GREEN}✓ Eureka Server está corriendo${NC}"
else
    echo -e "${RED}✗ Eureka Server NO está corriendo${NC}"
    echo "   Ejecuta: docker-compose up eureka-server -d"
    exit 1
fi
echo ""

echo "2. Verificando microservicio RESULTADOS-ESTADISTICAS-SERVICE..."
if curl -s "${SERVICE_URL}/actuator/health" > /dev/null; then
    echo -e "${GREEN}✓ Microservicio está corriendo${NC}"
else
    echo -e "${RED}✗ Microservicio NO está corriendo${NC}"
    echo "   Ejecuta: mvn spring-boot:run"
    exit 1
fi
echo ""

echo "3. Verificando registro en Eureka..."
sleep 5  # Esperar a que se complete el registro
REGISTERED=$(curl -s "${EUREKA_URL}/eureka/apps" | grep -c "RESULTADOS-ESTADISTICAS-SERVICE")
if [ "$REGISTERED" -gt 0 ]; then
    echo -e "${GREEN}✓ Servicio registrado en Eureka${NC}"
else
    echo -e "${YELLOW}⚠ Servicio aún no registrado (puede tomar hasta 60 segundos)${NC}"
fi
echo ""

echo "4. Listando servicios registrados..."
echo -e "${YELLOW}Servicios encontrados:${NC}"
curl -s "${SERVICE_URL}/eureka/services" | jq '.'
echo ""

echo "5. Obteniendo información detallada de servicios..."
curl -s "${SERVICE_URL}/eureka/services/info"
echo ""

echo "6. Verificando descubrimiento dinámico..."
echo -e "${YELLOW}Intentando comunicación con AUDITORIA-REGISTROS-SERVICE...${NC}"
RESULT=$(curl -s "${SERVICE_URL}/eureka/call-service?serviceName=AUDITORIA-REGISTROS-SERVICE&endpoint=/actuator/health")
if echo "$RESULT" | grep -q "Comunicación exitosa"; then
    echo -e "${GREEN}✓ Descubrimiento dinámico funciona correctamente${NC}"
    echo "$RESULT"
else
    echo -e "${YELLOW}⚠ Servicio de auditoría no disponible o no registrado${NC}"
    echo "$RESULT"
fi
echo ""

echo "=========================================="
echo "RESUMEN DE EVIDENCIAS"
echo "=========================================="
echo ""
echo "✓ Eureka Server: http://localhost:8761"
echo "✓ Dashboard Eureka: http://localhost:8761"
echo "✓ Microservicio: http://localhost:8086"
echo "✓ Swagger UI: http://localhost:8086/swagger-ui.html"
echo "✓ Health Check: http://localhost:8086/actuator/health"
echo ""
echo "Endpoints de demostración:"
echo "  - GET ${SERVICE_URL}/eureka/services"
echo "  - GET ${SERVICE_URL}/eureka/services/info"
echo "  - GET ${SERVICE_URL}/eureka/services/{name}/instances"
echo "  - GET ${SERVICE_URL}/eureka/call-service?serviceName=XXX&endpoint=/actuator/health"
echo ""
echo "=========================================="
