package com.votaciones.resultados_estadisticas.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuración de RestTemplate con Load Balancer para descubrimiento dinámico de servicios.
 * Permite comunicación entre microservicios usando nombres lógicos registrados en Eureka.
 */
@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate con balanceo de carga habilitado.
     * Permite hacer peticiones a otros microservicios usando su nombre lógico
     * en lugar de IP fija, por ejemplo: http://AUDITORIA-REGISTROS-SERVICE/api/...
     * 
     * @return RestTemplate configurado con Load Balancer
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
