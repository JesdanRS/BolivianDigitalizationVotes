package com.votaciones.resultados_estadisticas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API del Microservicio de Resultados y Estadísticas - Sistema de Votaciones Bolivia")
                        .version("1.0.0")
                        .description("Este microservicio gestiona los resultados electorales y estadísticas por mesa, departamento y nivel nacional.")
                        .termsOfService("http://swagger.io/terms/")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}


