package com.votaciones.candidatos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = {
	"spring.cloud.function.enabled=false",
	"spring.cloud.stream.enabled=false"
})
@ActiveProfiles("test")
class CandidatosApplicationTests {

	@Test
	void contextLoads() {
	}

}
