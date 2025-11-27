package com.votaciones.candidatos.auditoria;

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
                                String usuario,   // AHORA SIEMPRE VIENE DEL JSON (o constante)
                                String detalle) {

        try {
            String token = extraerTokenActual();
            if (token == null) {
                log.warn("No hay JWT en el contexto. Se omite registro de auditoría tipo={} modulo={}", tipo, modulo);
                return;
            }

            // Validación simple del CI
            if (usuario == null || !usuario.matches("\\d{7,8}")) {
                log.warn("Usuario inválido [{}] para auditoría tipo={} modulo={}. Evento NO se registra.",
                        usuario, tipo, modulo);
                return;
            }

            AuditoriaCreacionDto dto = new AuditoriaCreacionDto();
            dto.setTipo(tipo);
            dto.setSeveridad(severidad);
            dto.setModulo(modulo);
            dto.setUsuario(usuario);
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
            log.error("Error al registrar evento de auditoría tipo={} modulo={}: {}",
                    tipo, modulo, ex.getMessage(), ex);
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