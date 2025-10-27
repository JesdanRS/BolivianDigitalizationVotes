package com.votaciones.notificaciones.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.function.Consumer;

/**
 * Servicio listener para procesar eventos de candidatos desde Kafka
 * Recibe notificaciones cuando se crean, actualizan o eliminan candidatos
 */
@Service
@Slf4j
public class CandidatosEventListener {

	/**
	 * Consumer que escucha eventos del tópico 'notificaciones' de candidatos
	 * Estos eventos vienen con estructura:
	 * {
	 *   "tipo": "CANDIDATO_CREADO|CANDIDATO_ACTUALIZADO|CANDIDATO_ELIMINADO",
	 *   "candidatoId": 1,
	 *   "partido": "MAS",
	 *   "nombrePresidente": "Luis Arce",
	 *   "nombreVicepresidente": "David Choquehuanca",
	 *   "timestamp": "2025-10-27T04:31:37...",
	 *   "servicio": "candidatos"
	 * }
	 */
	@Bean
	public Consumer<Map<String, Object>> recibirEventoCandidatos() {
		return evento -> {
			try {
				String tipo = (String) evento.get("tipo");
				Long candidatoId = Long.valueOf(evento.get("candidatoId").toString());
				String partido = (String) evento.get("partido");
				String nombrePresidente = (String) evento.get("nombrePresidente");
				String nombreVicepresidente = (String) evento.get("nombreVicepresidente");
				String timestamp = (String) evento.get("timestamp");

				log.info("========================================");
				log.info("📢 EVENTO DE CANDIDATOS RECIBIDO");
				log.info("Tipo: {}", tipo);
				log.info("ID Candidato: {}", candidatoId);
				log.info("Partido: {}", partido);
				log.info("Presidente: {}", nombrePresidente);
				log.info("Vicepresidente: {}", nombreVicepresidente);
				log.info("Timestamp: {}", timestamp);
				log.info("========================================");

				// Procesar según el tipo de evento
				procesarEventoCandidato(tipo, candidatoId, partido, nombrePresidente, nombreVicepresidente);

			} catch (Exception e) {
				log.error("Error procesando evento de candidatos: {}", e.getMessage(), e);
			}
		};
	}

	/**
	 * Procesa el evento según su tipo
	 */
	private void procesarEventoCandidato(String tipo, Long candidatoId, String partido,
										String nombrePresidente, String nombreVicepresidente) {

		switch (tipo) {
			case "CANDIDATO_CREADO":
				procesarCreacion(candidatoId, partido, nombrePresidente, nombreVicepresidente);
				break;
			case "CANDIDATO_ACTUALIZADO":
				procesarActualizacion(candidatoId, partido, nombrePresidente, nombreVicepresidente);
				break;
			case "CANDIDATO_ELIMINADO":
				procesarEliminacion(candidatoId, partido);
				break;
			default:
				log.warn("Tipo de evento desconocido: {}", tipo);
		}
	}

	/**
	 * Maneja la creación de un candidato
	 * TODO: Implementar lógica real (enviar email, guardar en BD, etc.)
	 */
	private void procesarCreacion(Long candidatoId, String partido, String nombrePresidente, String nombreVicepresidente) {
		log.info("✅ NUEVO CANDIDATO CREADO");
		log.info("   Partido: {}", partido);
		log.info("   Presidente: {}", nombrePresidente);
		log.info("   Vicepresidente: {}", nombreVicepresidente);
		
		// TODO: Enviar notificación por email a administradores
		// TODO: Guardar en tabla de auditoría
		// TODO: Publicar notificación a usuarios suscritos
	}

	/**
	 * Maneja la actualización de un candidato
	 * TODO: Implementar lógica real
	 */
	private void procesarActualizacion(Long candidatoId, String partido, String nombrePresidente, String nombreVicepresidente) {
		log.info("🔄 CANDIDATO ACTUALIZADO");
		log.info("   ID: {}", candidatoId);
		log.info("   Partido: {}", partido);
		log.info("   Presidente: {}", nombrePresidente);
		
		// TODO: Enviar notificación a observadores
		// TODO: Guardar versión anterior en auditoría
	}

	/**
	 * Maneja la eliminación de un candidato
	 * TODO: Implementar lógica real
	 */
	private void procesarEliminacion(Long candidatoId, String partido) {
		log.info("❌ CANDIDATO ELIMINADO");
		log.info("   ID: {}", candidatoId);
		log.info("   Partido: {}", partido);
		
		// TODO: Enviar notificación de candidato removido
		// TODO: Guardar en tabla de auditoría con motivo
		// TODO: Limpiar votos asociados si aplica
	}
}
