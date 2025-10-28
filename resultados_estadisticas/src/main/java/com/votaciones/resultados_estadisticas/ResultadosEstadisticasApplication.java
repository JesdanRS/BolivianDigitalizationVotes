package com.votaciones.resultados_estadisticas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ResultadosEstadisticasApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResultadosEstadisticasApplication.class, args);
	}

}
