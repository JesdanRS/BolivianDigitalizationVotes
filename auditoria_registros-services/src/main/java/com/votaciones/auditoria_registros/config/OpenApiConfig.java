package com.votaciones.auditoria_registros.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.Scopes;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {
    @Value("${api.common.version}")
    String apiVersion;
    @Value("${api.common.title}")
    String apiTitle;
    @Value("${api.common.description}")
    String apiDescription;
    @Value("${api.common.termsOfService}")
    String apiTermsOfService;
    @Value("${api.common.license}")
    String apiLicense;
    @Value("${api.common.licenseUrl}")
    String apiLicenseUrl;
    @Value("${api.common.externalDocDesc}")
    String apiExternalDocDesc;
    @Value("${api.common.externalDocUrl}")
    String apiExternalDocUrl;
    @Value("${api.common.contact.name}")
    String apiContactName;
    @Value("${api.common.contact.url}")
    String apiContactUrl;
    @Value("${api.common.contact.email}")
    String apiContactEmail;

    /**
     * Se expone en $HOST:$PORT/swagger-ui.html
     *
     * @return la documentación OpenAPI común
     */
    @Bean
    public OpenAPI getOpenApiDocumentation() {
        // Servidor del Gateway (docker)
        Server gatewayServer = new Server();
        gatewayServer.setUrl("http://localhost:8080");
        gatewayServer.setDescription("API Gateway (Docker)");

        // Servidor directo (local)
        Server directServer = new Server();
        directServer.setUrl("http://localhost:8085");
        directServer.setDescription("Servicio directo (Local)");

        // Configuración del esquema de seguridad OAuth2 Password Flow
        final String securitySchemeName = "keycloak_oauth2";
        
        return new OpenAPI()
                .info(new Info().title(apiTitle).description(apiDescription).version(apiVersion)
                        .contact(new Contact().name(apiContactName).url(apiContactUrl).email(apiContactEmail))
                        .termsOfService(apiTermsOfService).license(new License().name(apiLicense).url(apiLicenseUrl)))
                .externalDocs(new ExternalDocumentation().description(apiExternalDocDesc).url(apiExternalDocUrl))
                .addServersItem(gatewayServer)
                .addServersItem(directServer)
                // Agregar el esquema de seguridad OAuth2 Password Flow (Keycloak)
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .description("Autenticación OAuth2 con Keycloak - Realm: votaciones")
                                        .flows(new OAuthFlows()
                                                .password(new OAuthFlow()
                                                        .tokenUrl("http://localhost:8090/realms/votaciones/protocol/openid-connect/token")
                                                        .scopes(new Scopes()
                                                                .addString("openid", "OpenID Connect")
                                                                .addString("profile", "Perfil de usuario")
                                                                .addString("email", "Email del usuario"))))))
                // Aplicar la seguridad globalmente a todos los endpoints
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
    }
}