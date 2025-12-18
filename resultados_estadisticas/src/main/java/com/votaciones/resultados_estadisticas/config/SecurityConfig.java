package com.votaciones.resultados_estadisticas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    /**
     * Filter chain para el endpoint de partidos - SIN validación OAuth2
     * Orden 1 (más alta prioridad) para ser evaluada primero
     */
    @Bean
    @Order(1)
    public SecurityFilterChain partidosSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/resultados/partidos", "/api/resultados/partidos/**")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()); // Permitir TODO sin autenticación

        return http.build();
    }

    /**
     * Filter chain principal para el resto de endpoints - CON validación OAuth2
     * Orden 2 (menor prioridad) se aplica a lo que no coincide con el anterior
     */
    @Bean
    @Order(2)
    public SecurityFilterChain mainSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/webjars/**").permitAll()

                        // Endpoints específicos con roles
                        .requestMatchers(HttpMethod.GET, "/api/resultados/**").hasAnyRole("AUDITOR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/resultados/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/resultados/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/resultados/**").hasRole("ADMIN")

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            if (realmAccess == null || !realmAccess.containsKey("roles")) {
                return List.of();
            }
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        });
        return converter;
    }
}
