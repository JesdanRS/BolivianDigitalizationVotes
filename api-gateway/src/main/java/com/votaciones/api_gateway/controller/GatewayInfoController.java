package com.votaciones.api_gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para mostrar información del API Gateway
 */
@RestController
public class GatewayInfoController {

    @GetMapping("/")
    public Map<String, Object> getGatewayInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("servicio", "API Gateway - Sistema de Votaciones Bolivianas");
        info.put("version", "1.0.0");
        info.put("estado", "Activo");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("Usuarios API", "http://localhost:8080/api/usuarios");
        endpoints.put("Votaciones API", "http://localhost:8080/api/votaciones");
        endpoints.put("Swagger Votaciones", "http://localhost:8080/votaciones/swagger-ui/index.html");
        endpoints.put("Swagger Usuarios", "http://localhost:8080/usuarios/swagger-ui/index.html");
        endpoints.put("Eureka Dashboard", "http://localhost:8761");
        endpoints.put("Keycloak Admin", "http://localhost:8180");
        
        info.put("endpoints_disponibles", endpoints);
        
        Map<String, String> documentacion = new HashMap<>();
        documentacion.put("Keycloak Setup", "Ver archivo KEYCLOAK_SETUP.md");
        documentacion.put("Quick Start", "Ver archivo KEYCLOAK_QUICK_START.md");
        
        info.put("documentacion", documentacion);
        
        return info;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "api-gateway");
        return health;
    }
}
