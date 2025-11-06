package com.votaciones.resultados_estadisticas.controller;

import com.votaciones.resultados_estadisticas.service.EurekaDiscoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para demostrar el descubrimiento dinámico de servicios con Eureka.
 * Evidencia del criterio: "Los microservicios se comunican por nombre lógico, no por IP fija"
 */
@RestController
@RequestMapping("/eureka")
@Tag(name = "Eureka Discovery", description = "Endpoints para demostrar descubrimiento dinámico de servicios")
public class EurekaDiscoveryController {

    @Autowired
    private EurekaDiscoveryService discoveryService;

    @Operation(
        summary = "Listar servicios registrados en Eureka",
        description = "Muestra todos los microservicios registrados en el servidor Eureka"
    )
    @GetMapping("/services")
    @ApiResponse(responseCode = "200", description = "Lista de servicios registrados")
    public ResponseEntity<List<String>> getRegisteredServices() {
        return ResponseEntity.ok(discoveryService.getRegisteredServices());
    }

    @Operation(
        summary = "Obtener instancias de un servicio",
        description = "Muestra las instancias registradas de un servicio específico"
    )
    @GetMapping("/services/{serviceName}/instances")
    @ApiResponse(responseCode = "200", description = "Lista de instancias del servicio")
    public ResponseEntity<List<ServiceInstance>> getServiceInstances(
            @Parameter(description = "Nombre del servicio", example = "AUDITORIA-REGISTROS-SERVICE")
            @PathVariable String serviceName) {
        return ResponseEntity.ok(discoveryService.getServiceInstances(serviceName));
    }

    @Operation(
        summary = "Información detallada de servicios",
        description = "Muestra información detallada de todos los servicios registrados en Eureka"
    )
    @GetMapping("/services/info")
    @ApiResponse(responseCode = "200", description = "Información detallada de servicios")
    public ResponseEntity<String> getServicesInfo() {
        return ResponseEntity.ok(discoveryService.getServicesInfo());
    }

    @Operation(
        summary = "Verificar si un servicio está registrado",
        description = "Verifica si un servicio específico está registrado en Eureka"
    )
    @GetMapping("/services/{serviceName}/registered")
    @ApiResponse(responseCode = "200", description = "Estado de registro del servicio")
    public ResponseEntity<Boolean> isServiceRegistered(
            @Parameter(description = "Nombre del servicio", example = "AUDITORIA-REGISTROS-SERVICE")
            @PathVariable String serviceName) {
        return ResponseEntity.ok(discoveryService.isServiceRegistered(serviceName));
    }

    @Operation(
        summary = "Comunicación con otro servicio por nombre lógico",
        description = "EVIDENCIA DE DESCUBRIMIENTO DINÁMICO: Hace una petición a otro microservicio " +
                     "usando su nombre lógico (no IP fija). Eureka resuelve automáticamente la ubicación del servicio."
    )
    @GetMapping("/call-service")
    @ApiResponse(responseCode = "200", description = "Resultado de la comunicación")
    public ResponseEntity<String> callServiceByName(
            @Parameter(description = "Nombre lógico del servicio", example = "AUDITORIA-REGISTROS-SERVICE")
            @RequestParam String serviceName,
            @Parameter(description = "Endpoint del servicio", example = "/actuator/health")
            @RequestParam(defaultValue = "/actuator/health") String endpoint) {
        String result = discoveryService.callServiceByName(serviceName, endpoint);
        return ResponseEntity.ok(result);
    }
}
