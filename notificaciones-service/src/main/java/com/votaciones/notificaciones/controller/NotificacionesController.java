package com.votaciones.notificaciones.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller para recibir eventos HTTP desde otros microservicios
 * (especialmente desde candidatos-service)
 */
@RestController
@RequestMapping("/api/notificaciones")
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificacionesController {

    /**
     * Endpoint para recibir eventos de candidatos
     * Espera un payload con estructura Event<Long, candidatosDto>
     */
    @PostMapping("/evento")
    public ResponseEntity<Map<String, Object>> recibirEvento(@RequestBody Map<String, Object> evento) {
        try {
            log.info("==========================================");
            log.info("🔔 EVENTO RECIBIDO EN NOTIFICACIONES");
            log.info("Payload: {}", evento);
            
            // Extraer datos del evento
            Object eventType = evento.get("eventType");
            Object key = evento.get("key");
            Object data = evento.get("data");
            Object timestamp = evento.get("eventCreatedAt");
            
            log.info("Tipo: {}", eventType);
            log.info("Key: {}", key);
            log.info("Data: {}", data);
            log.info("Timestamp: {}", timestamp);
            log.info("==========================================");
            
            // Procesamos el evento (aquí iría lógica de persistencia, envío de emails, etc.)
            procesarEventoCandidato(eventType, key, data);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Evento procesado correctamente",
                "eventType", eventType
            ));
            
        } catch (Exception e) {
            log.error("❌ Error procesando evento: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Procesa el evento según su tipo
     */
    private void procesarEventoCandidato(Object eventType, Object key, Object data) {
        try {
            if (eventType == null) {
                log.warn("Tipo de evento nulo");
                return;
            }
            
            String tipo = eventType.toString().toUpperCase();
            
            switch (tipo) {
                case "CREATE":
                    log.info("✅ CANDIDATO CREADO: ID={}, Data={}", key, data);
                    // Guardar notificación en BD, enviar email, etc.
                    break;
                case "UPDATE":
                    log.info("🔄 CANDIDATO ACTUALIZADO: ID={}, Data={}", key, data);
                    break;
                case "DELETE":
                    log.info("🗑️  CANDIDATO ELIMINADO: ID={}", key);
                    break;
                default:
                    log.warn("Tipo de evento desconocido: {}", tipo);
            }
            
        } catch (Exception e) {
            log.error("Error al procesar evento: {}", e.getMessage(), e);
        }
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Notificaciones service está operativo");
    }
}
