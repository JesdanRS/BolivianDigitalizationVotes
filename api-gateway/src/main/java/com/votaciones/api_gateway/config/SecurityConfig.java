package com.votaciones.api_gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(exchanges -> exchanges
                // Rutas públicas
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/eureka/**").permitAll()
                .pathMatchers("/swagger-ui/**").permitAll()
                .pathMatchers("/webjars/**").permitAll()
                .pathMatchers("/v3/api-docs/**").permitAll()
                .pathMatchers("/api/auditoria/v3/api-docs").permitAll()
                
                // Rutas protegidas - requieren autenticación
                .pathMatchers("/api/**").authenticated()
                
                // Cualquier otra ruta
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(grantedAuthoritiesExtractor()))
            );

        return http.build();
    }

    /**
     * Extrae los roles desde realm_access.roles del JWT de Keycloak
     * y los convierte a GrantedAuthorities con prefijo ROLE_
     */
    Converter<Jwt, Mono<AbstractAuthenticationToken>> grantedAuthoritiesExtractor() {
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

        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }

    /**
     * JwtDecoder personalizado que NO valida el issuer claim.
     * Esto permite aceptar tokens con issuer "localhost:8090" aunque los servicios
     * se conecten vía "host.docker.internal:8090"
     */
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        NimbusReactiveJwtDecoder jwtDecoder = NimbusReactiveJwtDecoder
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
