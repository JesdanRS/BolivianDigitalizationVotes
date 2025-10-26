package com.votaciones.notificaciones.service;

import com.votaciones.notificaciones.dto.NotificacionDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import java.util.function.Consumer;

@Service
@Slf4j
public class ListenerService {

    // Spring Cloud Stream buscará un Bean de tipo Consumer o Function
    // cuyo nombre coincida con la parte 'procesarNotificacion' del binding.
    @Bean
    public Consumer<NotificacionDto> procesarNotificacion() {
        return notificacion -> {
            // Este es el código que se ejecuta cuando llega un mensaje de Kafka.
            log.info("===================================================");
            log.info("RECIBIDA NUEVA NOTIFICACIÓN PARA ENVIAR POR EMAIL:");
            log.info("Destinatario: {}", notificacion.getDestinatario());
            log.info("Asunto: {}", notificacion.getAsunto());
            log.info("Cuerpo: {}", notificacion.getCuerpo());
            log.info("===================================================");

            // TODO: Aquí iría la lógica real para conectarse a un servicio
            // de envío de emails (como SendGrid, AWS SES, etc.) y enviar el correo.
        };
    }
}