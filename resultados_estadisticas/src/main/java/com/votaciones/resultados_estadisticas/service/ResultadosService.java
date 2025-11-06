package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.exception.RecursoNoEncontradoException;
import com.votaciones.resultados_estadisticas.exception.SolicitudInvalidaException;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.repository.ResultadoMesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResultadosService {

	@Autowired
	private ResultadoMesaRepository repository;

	@PostConstruct
	public void inicializarDatosEjemplo() {
		// Solo inicializar si la base de datos está vacía
		if (repository.count() == 0) {
			cargarDatosIniciales();
		}
	}

	@Transactional(readOnly = true)
	public List<ResultadoMesa> listarResultados() {
		return repository.findAll();
	}

	@Transactional(readOnly = true)
	public List<ResultadoMesa> listarPorDepartamento(String departamento) {
		return repository.findByDepartamentoIgnoreCase(departamento);
	}

	@Transactional(readOnly = true)
	public ResultadoMesa obtenerPorId(Long id) {
		return repository.findById(id)
			.orElseThrow(() -> new RecursoNoEncontradoException("ResultadoMesa", id));
	}

	@Transactional(readOnly = true)
	public List<EstadisticaDto> estadisticasPorDepartamento() {
		List<ResultadoMesa> todos = repository.findAll();
		Map<String, List<ResultadoMesa>> agrupado = todos.stream()
			.collect(Collectors.groupingBy(ResultadoMesa::getDepartamento));

		return agrupado.entrySet().stream()
			.map(entry -> calcularEstadistica(entry.getKey(), entry.getValue()))
			.toList();
	}

	@Transactional(readOnly = true)
	public EstadisticaDto estadisticaDe(String departamento) {
		List<ResultadoMesa> lista = listarPorDepartamento(departamento);
		if (lista.isEmpty()) {
			throw new RecursoNoEncontradoException("Departamento", departamento);
		}
		return calcularEstadistica(departamento, lista);
	}

	@Transactional(readOnly = true)
	public List<EstadisticaDto> estadisticasPorDepartamento(String canal) {
		String canalNormalizado = normalizarCanal(canal);
		List<ResultadoMesa> todos = repository.findAll();
		Map<String, List<ResultadoMesa>> agrupado = todos.stream()
			.collect(Collectors.groupingBy(ResultadoMesa::getDepartamento));

		return agrupado.entrySet().stream()
			.map(entry -> calcularEstadistica(entry.getKey(), entry.getValue(), canalNormalizado))
			.toList();
	}

	@Transactional(readOnly = true)
	public EstadisticaDto estadisticaDe(String departamento, String canal) {
		String canalNormalizado = normalizarCanal(canal);
		List<ResultadoMesa> lista = listarPorDepartamento(departamento);
		if (lista.isEmpty()) {
			throw new RecursoNoEncontradoException("Departamento", departamento);
		}
		return calcularEstadistica(departamento, lista, canalNormalizado);
	}

	private EstadisticaDto calcularEstadistica(String departamento, List<ResultadoMesa> lista) {
		long inscritos = lista.stream().mapToLong(ResultadoMesa::getInscritos).sum();
		long validos = lista.stream().mapToLong(ResultadoMesa::getVotosValidos).sum();
		long nulos = lista.stream().mapToLong(ResultadoMesa::getVotosNulos).sum();
		long blancos = lista.stream().mapToLong(ResultadoMesa::getVotosBlancos).sum();
		long totalEmitidos = validos + nulos + blancos;
		double participacion = inscritos > 0 ? (totalEmitidos * 100.0) / inscritos : 0.0;
		EstadisticaDto dto = new EstadisticaDto(departamento, inscritos, validos, nulos, blancos, participacion);
		// También podemos poblar los campos por canal si se necesita en totales
		long vvp = lista.stream().mapToLong(ResultadoMesa::getVotosValidosPresencial).sum();
		long vnp = lista.stream().mapToLong(ResultadoMesa::getVotosNulosPresencial).sum();
		long vbp = lista.stream().mapToLong(ResultadoMesa::getVotosBlancosPresencial).sum();
		long vvw = lista.stream().mapToLong(ResultadoMesa::getVotosValidosWeb).sum();
		long vnw = lista.stream().mapToLong(ResultadoMesa::getVotosNulosWeb).sum();
		long vbw = lista.stream().mapToLong(ResultadoMesa::getVotosBlancosWeb).sum();
		dto.setVotosValidosPresencial(vvp);
		dto.setVotosNulosPresencial(vnp);
		dto.setVotosBlancosPresencial(vbp);
		dto.setVotosValidosWeb(vvw);
		dto.setVotosNulosWeb(vnw);
		dto.setVotosBlancosWeb(vbw);
		return dto;
	}

	private EstadisticaDto calcularEstadistica(String departamento, List<ResultadoMesa> lista, String canal) {
		if (canal == null) {
			return calcularEstadistica(departamento, lista);
		}
		long inscritos = lista.stream().mapToLong(ResultadoMesa::getInscritos).sum();
		long validos;
		long nulos;
		long blancos;
		EstadisticaDto dto;
		if ("presencial".equals(canal)) {
			validos = lista.stream().mapToLong(ResultadoMesa::getVotosValidosPresencial).sum();
			nulos = lista.stream().mapToLong(ResultadoMesa::getVotosNulosPresencial).sum();
			blancos = lista.stream().mapToLong(ResultadoMesa::getVotosBlancosPresencial).sum();
			dto = new EstadisticaDto(departamento, inscritos, validos, nulos, blancos, inscritos > 0 ? ((validos + nulos + blancos) * 100.0) / inscritos : 0.0);
			dto.setVotosValidosPresencial(validos);
			dto.setVotosNulosPresencial(nulos);
			dto.setVotosBlancosPresencial(blancos);
		} else { // web
			validos = lista.stream().mapToLong(ResultadoMesa::getVotosValidosWeb).sum();
			nulos = lista.stream().mapToLong(ResultadoMesa::getVotosNulosWeb).sum();
			blancos = lista.stream().mapToLong(ResultadoMesa::getVotosBlancosWeb).sum();
			dto = new EstadisticaDto(departamento, inscritos, validos, nulos, blancos, inscritos > 0 ? ((validos + nulos + blancos) * 100.0) / inscritos : 0.0);
			dto.setVotosValidosWeb(validos);
			dto.setVotosNulosWeb(nulos);
			dto.setVotosBlancosWeb(blancos);
		}
		return dto;
	}

	private String normalizarCanal(String canal) {
		if (canal == null || canal.isBlank()) return null;
		String c = canal.trim().toLowerCase();
		if ("presencial".equals(c) || "web".equals(c)) return c;
		throw new SolicitudInvalidaException("El parámetro canal debe ser 'presencial' o 'web'.");
	}

	private void cargarDatosIniciales() {
		ResultadoMesa r1 = new ResultadoMesa(
			"La Paz", "La Paz", "Coliseo Central", "Mesa 1", 300,
			180, 12, 4, // presencial
			30, 3, 1     // web
		);
		repository.save(r1);

		ResultadoMesa r2 = new ResultadoMesa(
			"La Paz", "La Paz", "Coliseo Central", "Mesa 2", 280,
			170, 8, 6, // presencial
			20, 2, 2   // web
		);
		repository.save(r2);

		ResultadoMesa r3 = new ResultadoMesa(
			"Santa Cruz", "Santa Cruz de la Sierra", "Unidad Educativa 12", "Mesa 5", 350,
			230, 9, 6, // presencial
			30, 3, 3   // web
		);
		repository.save(r3);

		ResultadoMesa r4 = new ResultadoMesa(
			"Cochabamba", "Cercado", "Escuela Central", "Mesa 3", 320,
			210, 9, 5, // presencial
			20, 2, 2   // web
		);
		repository.save(r4);
	}
}


