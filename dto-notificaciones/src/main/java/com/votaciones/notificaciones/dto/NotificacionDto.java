package com.votaciones.notificaciones.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionDto {
    private String destinatario; 
    private String asunto;       
    private String cuerpo;       
}
