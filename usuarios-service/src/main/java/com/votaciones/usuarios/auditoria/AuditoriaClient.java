package main.java.com.votaciones.usuarios.auditoria;

import com.votaciones.auditoria_registros.dto.AuditoriaCreacionDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AuditoriaClient {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AuditoriaClient(RestTemplate auditoriaRestTemplate,
                           @Value("${app.auditoria.base-url:http://AUDITORIA-REGISTROS-SERVICE}")
                           String baseUrl) {
        this.restTemplate = auditoriaRestTemplate;
        this.baseUrl = baseUrl;
    }

    public void registrarEvento(String tipo,
                                String severidad,
                                String modulo,
                                String usuario,   // puede venir null
                                String detalle) {

        try {
            String token = extraerTokenActual();
            if (token == null) {
                log.warn("No hay JWT en el contexto. Se omite registro de auditoría tipo={} modulo={}", tipo, modulo);
                return;
            }

            String usuarioFinal = normalizarUsuario(usuario);
            if (usuarioFinal == null) {
                log.warn("No se pudo determinar CI del usuario para auditoría tipo={} modulo={}. Evento NO se registra.", tipo, modulo);
                return;
                // O, si prefieres forzar algo:
                // usuarioFinal = "00000000";
            }

            AuditoriaCreacionDto dto = new AuditoriaCreacionDto();
            dto.setTipo(tipo);
            dto.setSeveridad(severidad);
            dto.setModulo(modulo);
            dto.setUsuario(usuarioFinal);
            dto.setDetalle(detalle);
            dto.setIp("0.0.0.0");
            dto.setCorrelacion(UUID.randomUUID().toString());

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
            // NUNCA romper el flujo de negocio por la auditoría
            log.error("Error al registrar evento de auditoría tipo={} modulo={}: {}", tipo, modulo, ex.getMessage(), ex);
        }
    }

    private String extraerTokenActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getTokenValue();
        }
        return null;
    }

    private String normalizarUsuario(String usuarioParam) {
        // 1) Si el service ya pasó un CI válido, úsalo
        if (usuarioParam != null && usuarioParam.matches("\\d{7,10}")) {
            return usuarioParam;
        }

        // 2) Si no, intenta sacarlo del JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();

            // a) Claim personalizado "ci"
            String ciClaim = jwt.getClaimAsString("ci");
            if (ciClaim != null && ciClaim.matches("\\d{7,10}")) {
                return ciClaim;
            }

            // b) preferred_username = CI
            String preferredUsername = jwt.getClaimAsString("preferred_username");
            if (preferredUsername != null && preferredUsername.matches("\\d{7,10}")) {
                return preferredUsername;
            }
        }

        // 3) Nada válido encontrado
        return null;
    }
}