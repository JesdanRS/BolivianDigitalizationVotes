package com.votaciones.auditoria_registros.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI auditoriaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Auditoría y Registros - Sistema de Votaciones")
                        .description("Microservicio para la auditoría y registro de acciones dentro del sistema de votaciones electorales.")
                        .version("1.0.0")
                        .termsOfService("https://www.tuvotacion.com/terminos")
                        .contact(new Contact()
                                .name("Soporte Sistema de Votaciones")
                                .url("https://www.tuvotacion.com/contacto")
                                .email("soporte@tuvotacion.com"))
                        .license(new License()
                                .name("Licencia MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Documentación en Wiki")
                        .url("https://www.tuvotacion.com/wiki"));
    }
}
