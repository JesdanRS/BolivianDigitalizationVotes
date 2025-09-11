package com.votaciones.usuarios.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

/**
 * Configuración de OpenAPI/Swagger para el microservicio de usuarios
 */
@Configuration
public class OpenApiConfig {

    @Value("${api.common.title:API Usuarios - Sistema de Votaciones Bolivianas}")
    private String title;

    @Value("${api.common.description:Microservicio para la gestión de usuarios en el sistema de digitalización de votaciones bolivianas}")
    private String description;

    @Value("${api.common.version:1.0.0}")
    private String version;

    @Value("${api.common.termsOfService:https://www.bolivia.gob.bo/terminos}")
    private String termsOfService;

    @Value("${api.common.license:Licencia Pública General v3.0}")
    private String licenseName;

    @Value("${api.common.licenseUrl:https://www.gnu.org/licenses/gpl-3.0.html}")
    private String licenseUrl;

    @Value("${api.common.contact.name:Equipo de Desarrollo - Sistema de Votaciones}")
    private String contactName;

    @Value("${api.common.contact.url:https://www.bolivia.gob.bo/contacto}")
    private String contactUrl;

    @Value("${api.common.contact.email:soporte.votaciones@bolivia.gob.bo}")
    private String contactEmail;

    @Value("${api.common.externalDocDesc:Documentación del Sistema de Votaciones}")
    private String externalDesc;

    @Value("${api.common.externalDocUrl:https://www.bolivia.gob.bo/sistema-votaciones}")
    private String externalUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title(title)
                .description(description)
                .version(version)
                .termsOfService(termsOfService)
                .license(new License().name(licenseName).url(licenseUrl))
                .contact(new Contact()
                    .name(contactName)
                    .url(contactUrl)
                    .email(contactEmail)))
            .externalDocs(new ExternalDocumentation()
                .description(externalDesc)
                .url(externalUrl));
    }
}

