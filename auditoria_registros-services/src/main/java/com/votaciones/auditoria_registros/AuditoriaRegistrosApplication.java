package com.votaciones.auditoria_registros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class AuditoriaRegistrosApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuditoriaRegistrosApplication.class, args);
	}

}
