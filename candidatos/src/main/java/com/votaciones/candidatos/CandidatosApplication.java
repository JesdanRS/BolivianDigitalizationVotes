package com.votaciones.candidatos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(exclude = {
	org.springframework.cloud.function.context.config.ContextFunctionCatalogAutoConfiguration.class
})
@EnableDiscoveryClient
public class CandidatosApplication {

	public static void main(String[] args) {
		SpringApplication.run(CandidatosApplication.class, args);
	}

}
