package main.java.com.votaciones.usuarios.auditoria;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AuditoriaClient {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AuditoriaClient(
            RestTemplate auditoriaRestTemplate,
            @Value("${app.auditoria.base-url:http://AUDITORIA-REGISTROS-SERVICE}") String baseUrl
    ) {
        this.restTemplate = auditoriaRestTemplate;
        this.baseUrl = baseUrl;
    }

    public void registrarEvento(AuditoriaCreacionDto dto) {
        try {
            String token = extraerTokenActual();
            if (token == null) {
                log.warn("No hay JWT en el contexto de seguridad. Se omite registro de auditoría.");
                return;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<AuditoriaCreacionDto> entity = new HttpEntity<>(dto, headers);

            restTemplate.exchange(
                    baseUrl + "/api/auditoria",
                    HttpMethod.POST,
                    entity,
                    Void.class
            );

        } catch (Exception ex) {
            // NUNCA tumbar el flujo de negocio por fallos en auditoría
            log.error("Error al registrar evento de auditoría", ex);
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
