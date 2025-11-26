package com.votaciones.auditoria_registros.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/swagger-ui.html").permitAll()
                
                // Endpoints específicos con roles
                .requestMatchers(HttpMethod.GET, "/api/auditoria/**").hasAnyRole("USER", "AUDITOR")
                .requestMatchers(HttpMethod.POST, "/api/auditoria/**").hasAnyRole("USER", "ADMIN", "AUDITOR")
                .requestMatchers(HttpMethod.PUT, "/api/auditoria/**").hasRole("AUDITOR")
                .requestMatchers(HttpMethod.DELETE, "/api/auditoria/**").hasRole("AUDITOR")
                
                // Cualquier otra petición requiere autenticación
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );

        return http.build();
    }

    /**
     * Extrae los roles desde realm_access.roles del JWT de Keycloak
     * y los convierte a GrantedAuthorities con prefijo ROLE_
     */
    @Bean
    public Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            Collection<GrantedAuthority> authorities;
            
            if (realmAccess != null && realmAccess.get("roles") != null) {
                authorities = ((List<String>) realmAccess.get("roles")).stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());
            } else {
                authorities = List.of();
            }
            
            return authorities;
        });
        
        return jwtAuthenticationConverter;
    }

    /**
     * JwtDecoder personalizado que NO valida el issuer claim.
     * Esto permite aceptar tokens con issuer "localhost:8090" aunque los servicios
     * se conecten vía "host.docker.internal:8090"
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
                .withJwkSetUri(jwkSetUri)
                .build();
        
        // Desactivar validación del issuer configurando un validador vacío
        // Solo se validará la firma del JWT usando las claves públicas de Keycloak
        jwtDecoder.setJwtValidator(token -> 
            org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success()
        );
        
        return jwtDecoder;
    }
}
