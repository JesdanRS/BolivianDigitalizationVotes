package com.votaciones.notificaciones.service;

import com.votaciones.notificaciones.dto.NotificacionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.function.Consumer;

@Service
@Slf4j
public class ListenerService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@votaciones.com}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Procesa notificaciones recibidas de Kafka y envía emails.
     * Si el envío de email está deshabilitado o falla, solo logea el mensaje.
     */
    @Bean
    public Consumer<NotificacionDto> procesarNotificacion() {
        return notificacion -> {
            log.info("===================================================");
            log.info("RECIBIDA NUEVA NOTIFICACIÓN PARA ENVIAR POR EMAIL:");
            log.info("Destinatario: {}", notificacion.getDestinatario());
            log.info("Asunto: {}", notificacion.getAsunto());
            log.info("Cuerpo: {}", notificacion.getCuerpo());
            log.info("===================================================");

            // Debug: mostrar configuración
            log.info("🔧 DEBUG: emailEnabled={}, mailSender={}", emailEnabled,
                    (mailSender != null ? "configurado" : "NULL"));

            if (emailEnabled && mailSender != null) {
                try {
                    enviarEmail(notificacion);
                    log.info("✅ Email enviado exitosamente a: {}", notificacion.getDestinatario());
                } catch (Exception e) {
                    log.error("❌ Error enviando email: {}. El código se puede ver en los logs.", e.getMessage(), e);
                }
            } else {
                log.info("📧 Email deshabilitado. El código de verificación se puede ver arriba en los logs.");
            }
        };
    }

    /**
     * Envía un email usando JavaMailSender.
     */
    private void enviarEmail(NotificacionDto notificacion) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(notificacion.getDestinatario());
        message.setSubject(notificacion.getAsunto());
        message.setText(notificacion.getCuerpo());
        mailSender.send(message);
    }
}
