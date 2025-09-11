package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ResultadosService {

	private final List<ResultadoMesa> resultados = new ArrayList<>();
	private final AtomicLong contadorId = new AtomicLong(1);

	public ResultadosService() {
		inicializarDatosEjemplo();
	}

	public List<ResultadoMesa> listarResultados() {
		return resultados;
	}

	public List<ResultadoMesa> listarPorDepartamento(String departamento) {
		return resultados.stream()
			.filter(r -> r.getDepartamento().equalsIgnoreCase(departamento))
			.toList();
	}

	public List<EstadisticaDto> estadisticasPorDepartamento() {
		Map<String, List<ResultadoMesa>> agrupado = resultados.stream()
			.collect(Collectors.groupingBy(ResultadoMesa::getDepartamento));

		return agrupado.entrySet().stream()
			.map(entry -> calcularEstadistica(entry.getKey(), entry.getValue()))
			.toList();
	}

	public EstadisticaDto estadisticaDe(String departamento) {
		List<ResultadoMesa> lista = listarPorDepartamento(departamento);
		if (lista.isEmpty()) {
			return new EstadisticaDto(departamento, 0, 0, 0, 0, 0.0);
		}
		return calcularEstadistica(departamento, lista);
	}

	private EstadisticaDto calcularEstadistica(String departamento, List<ResultadoMesa> lista) {
		long inscritos = lista.stream().mapToLong(ResultadoMesa::getInscritos).sum();
		long validos = lista.stream().mapToLong(ResultadoMesa::getVotosValidos).sum();
		long nulos = lista.stream().mapToLong(ResultadoMesa::getVotosNulos).sum();
		long blancos = lista.stream().mapToLong(ResultadoMesa::getVotosBlancos).sum();
		long totalEmitidos = validos + nulos + blancos;
		double participacion = inscritos > 0 ? (totalEmitidos * 100.0) / inscritos : 0.0;
		return new EstadisticaDto(departamento, inscritos, validos, nulos, blancos, participacion);
	}

	private void inicializarDatosEjemplo() {
		ResultadoMesa r1 = new ResultadoMesa("La Paz", "La Paz", "Coliseo Central", "Mesa 1", 300, 210, 15, 5);
		r1.setId(contadorId.getAndIncrement());
		r1.prePersist();
		resultados.add(r1);

		ResultadoMesa r2 = new ResultadoMesa("La Paz", "La Paz", "Coliseo Central", "Mesa 2", 280, 190, 10, 8);
		r2.setId(contadorId.getAndIncrement());
		r2.prePersist();
		resultados.add(r2);

		ResultadoMesa r3 = new ResultadoMesa("Santa Cruz", "Santa Cruz de la Sierra", "Unidad Educativa 12", "Mesa 5", 350, 260, 12, 9);
		r3.setId(contadorId.getAndIncrement());
		r3.prePersist();
		resultados.add(r3);

		ResultadoMesa r4 = new ResultadoMesa("Cochabamba", "Cercado", "Escuela Central", "Mesa 3", 320, 230, 11, 7);
		r4.setId(contadorId.getAndIncrement());
		r4.prePersist();
		resultados.add(r4);
	}
}


