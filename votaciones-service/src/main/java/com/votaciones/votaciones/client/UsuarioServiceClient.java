package com.votaciones.votaciones.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UsuarioServiceClient {

    private static final Logger log = LoggerFactory.getLogger(UsuarioServiceClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public UsuarioServiceClient(RestTemplate restTemplate,
                                @Value("${app.usuarios.base-url:http://USUARIOS-SERVICE}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public void marcarUsuarioComoVotado(String carnet) {
        try {
            String token = extraerTokenActual();
            if (token == null) {
                log.warn("No hay JWT en el contexto al intentar marcar usuario como votado. Carnet: {}", carnet);
                // Si no hay token, no podemos autenticarnos contra el otro servicio si requiere seguridad.
                // Asumimos que requiere token pasante.
                return;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            restTemplate.exchange(
                    baseUrl + "/api/usuarios/" + carnet + "/marcar-votado",
                    HttpMethod.POST,
                    entity,
                    Void.class
            );
            log.info("Usuario con carnet {} marcado como votado exitosamente en usuarios-service.", carnet);

        } catch (Exception ex) {
            log.error("Error al marcar usuario como votado en usuarios-service. Carnet: {}. Error: {}",
                    carnet, ex.getMessage());
            // Dependiendo del requisito, podríamos lanzar una excepción para hacer rollback del voto
            // O dejarlo pasar (lo que permitiría doble voto si falla la comunicación).
            // Para consistencia estricta, deberíamos lanzar excepción.
            throw new RuntimeException("No se pudo registrar el estado del voto en el servicio de usuarios. Intente nuevamente.");
        }
    }

    private String extraerTokenActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getTokenValue();
        }
        return null;
    }
}
