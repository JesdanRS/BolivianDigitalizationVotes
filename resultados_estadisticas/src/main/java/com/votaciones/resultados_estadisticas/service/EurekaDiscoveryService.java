package com.votaciones.resultados_estadisticas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Servicio de demostración para el descubrimiento dinámico de servicios con Eureka.
 * Muestra cómo los microservicios se comunican por nombre lógico, no por IP fija.
 */
@Service
public class EurekaDiscoveryService {

    @Autowired
    private DiscoveryClient discoveryClient;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Obtiene la lista de todos los servicios registrados en Eureka
     * 
     * @return Lista de nombres de servicios registrados
     */
    public List<String> getRegisteredServices() {
        return discoveryClient.getServices();
    }

    /**
     * Obtiene las instancias de un servicio específico
     * 
     * @param serviceName Nombre del servicio
     * @return Lista de instancias del servicio
     */
    public List<ServiceInstance> getServiceInstances(String serviceName) {
        return discoveryClient.getInstances(serviceName);
    }

    /**
     * Obtiene información detallada de todos los servicios registrados
     * 
     * @return Información de servicios en formato String
     */
    public String getServicesInfo() {
        List<String> services = getRegisteredServices();
        
        StringBuilder info = new StringBuilder();
        info.append("=== SERVICIOS REGISTRADOS EN EUREKA ===\n\n");
        info.append("Total de servicios: ").append(services.size()).append("\n\n");
        
        for (String serviceName : services) {
            List<ServiceInstance> instances = getServiceInstances(serviceName);
            info.append("Servicio: ").append(serviceName).append("\n");
            info.append("Instancias: ").append(instances.size()).append("\n");
            
            for (ServiceInstance instance : instances) {
                info.append("  - URI: ").append(instance.getUri()).append("\n");
                info.append("    Host: ").append(instance.getHost()).append("\n");
                info.append("    Puerto: ").append(instance.getPort()).append("\n");
            }
            info.append("\n");
        }
        
        return info.toString();
    }

    /**
     * Ejemplo de comunicación con otro microservicio usando nombre lógico.
     * Demuestra el descubrimiento dinámico: no se usa IP fija, sino el nombre del servicio.
     * 
     * @param serviceName Nombre lógico del servicio (ej: AUDITORIA-REGISTROS-SERVICE)
     * @param endpoint Endpoint del servicio (ej: /api/auditoria)
     * @return Respuesta del servicio o mensaje de error
     */
    public String callServiceByName(String serviceName, String endpoint) {
        try {
            // La URL usa el nombre lógico del servicio, no una IP fija
            // Eureka resuelve automáticamente el nombre al host/puerto correcto
            String url = "http://" + serviceName + endpoint;
            
            // RestTemplate con @LoadBalanced hace la resolución automática
            String response = restTemplate.getForObject(url, String.class);
            
            return "✓ Comunicación exitosa con " + serviceName + "\n" +
                   "URL usada: " + url + "\n" +
                   "Respuesta: " + (response != null ? response.substring(0, Math.min(200, response.length())) : "null");
        } catch (Exception e) {
            return "✗ Error al comunicar con " + serviceName + ": " + e.getMessage();
        }
    }

    /**
     * Verifica si un servicio específico está registrado en Eureka
     * 
     * @param serviceName Nombre del servicio a verificar
     * @return true si el servicio está registrado, false en caso contrario
     */
    public boolean isServiceRegistered(String serviceName) {
        return getRegisteredServices().stream()
                .anyMatch(name -> name.equalsIgnoreCase(serviceName));
    }
}
