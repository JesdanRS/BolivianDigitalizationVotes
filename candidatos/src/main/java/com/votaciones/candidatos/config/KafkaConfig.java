package com.votaciones.candidatos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import java.util.function.Supplier;
import java.util.function.Function;

/**
 * Configuración para Spring Cloud Stream y Kafka
 * StreamBridge se auto-configura cuando existen funciones definidas
 */
@Configuration
public class KafkaConfig {

	/**
	 * Define un supplier para habilitar los bindings de Kafka
	 * Esto FUERZA a Spring Cloud Stream a crear StreamBridge bean
	 */
	@Bean
	public Supplier<Message<String>> enviarNotificacion() {
		return () -> MessageBuilder.withPayload("{}").build();
	}

	/**
	 * Dummy function para asegurar que Spring Cloud Stream se inicialice completamente
	 */
	@Bean
	public Function<String, String> dummyProcessor() {
		return input -> input.toUpperCase();
	}
}
