package com.votaciones.resultados_estadisticas.service;

import com.votaciones.resultados_estadisticas.dto.EstadisticaDto;
import com.votaciones.resultados_estadisticas.exception.RecursoNoEncontradoException;
import com.votaciones.resultados_estadisticas.model.ResultadoMesa;
import com.votaciones.resultados_estadisticas.repository.ResultadoMesaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service para gestionar resultados de votación por mesa
 * Implementa CRUD completo con datos reales desde PostgreSQL
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ResultadosService {

	private final ResultadoMesaRepository resultadoMesaRepository;

	/**
	 * Inicializa datos de ejemplo si la BD está vacía
	 */
	@PostConstruct
	public void inicializarDatosEjemplo() {
		if (resultadoMesaRepository.count() == 0) {
			log.info("Inicializando datos de ejemplo en BD...");
			
			ResultadoMesa r1 = new ResultadoMesa(null, "La Paz", "La Paz", "Coliseo Central", "Mesa 1", 
				300L, 180L, 12L, 4L, 30L, 3L, 1L, null, null);
			ResultadoMesa r2 = new ResultadoMesa(null, "La Paz", "La Paz", "Coliseo Central", "Mesa 2", 
				280L, 170L, 8L, 6L, 20L, 2L, 2L, null, null);
			ResultadoMesa r3 = new ResultadoMesa(null, "Santa Cruz", "Santa Cruz de la Sierra", "Unidad Educativa 12", "Mesa 5", 
				350L, 230L, 9L, 6L, 30L, 3L, 3L, null, null);
			ResultadoMesa r4 = new ResultadoMesa(null, "Cochabamba", "Cercado", "Escuela Central", "Mesa 3", 
				320L, 210L, 9L, 5L, 20L, 2L, 2L, null, null);
			
			resultadoMesaRepository.saveAll(List.of(r1, r2, r3, r4));
			log.info("Datos de ejemplo inicializados: {} registros", resultadoMesaRepository.count());
		}
	}

	// ========================================
	// CRUD BÁSICO
	// ========================================

	@Transactional
	public ResultadoMesa crear(ResultadoMesa resultado) {
		log.info("Creando nuevo resultado de mesa");
		return resultadoMesaRepository.save(resultado);
	}

	@Transactional(readOnly = true)
	public ResultadoMesa obtenerPorId(Long id) {
		return resultadoMesaRepository.findById(id)
			.orElseThrow(() -> new RecursoNoEncontradoException("ResultadoMesa", id));
	}

	@Transactional(readOnly = true)
	public List<ResultadoMesa> listarResultados() {
		return resultadoMesaRepository.findAll();
	}

	@Transactional
	public ResultadoMesa actualizar(Long id, ResultadoMesa resultado) {
		ResultadoMesa existente = obtenerPorId(id);
		existente.setDepartamento(resultado.getDepartamento());
		existente.setMunicipio(resultado.getMunicipio());
		existente.setRecinto(resultado.getRecinto());
		existente.setMesa(resultado.getMesa());
		existente.setInscritos(resultado.getInscritos());
		existente.setVotosValidosPresencial(resultado.getVotosValidosPresencial());
		existente.setVotosNulosPresencial(resultado.getVotosNulosPresencial());
		existente.setVotosBlancosPresencial(resultado.getVotosBlancosPresencial());
		existente.setVotosValidosWeb(resultado.getVotosValidosWeb());
		existente.setVotosNulosWeb(resultado.getVotosNulosWeb());
		existente.setVotosBlancosWeb(resultado.getVotosBlancosWeb());
		return resultadoMesaRepository.save(existente);
	}

	@Transactional
	public void eliminar(Long id) {
		if (!resultadoMesaRepository.existsById(id)) {
			throw new RecursoNoEncontradoException("ResultadoMesa", id);
		}
		resultadoMesaRepository.deleteById(id);
		log.info("ResultadoMesa {} eliminado", id);
	}

	// ========================================
	// CONSULTAS CON REPOSITORY
	// ========================================

	/**
	 * DERIVED QUERY - Busca por departamento
	 */
	@Transactional(readOnly = true)
	public List<ResultadoMesa> listarPorDepartamento(String departamento) {
		return resultadoMesaRepository.findByDepartamentoIgnoreCase(departamento);
	}

	/**
	 * JPQL QUERY - Busca mesas con mínimo de inscritos
	 */
	@Transactional(readOnly = true)
	public List<ResultadoMesa> buscarPorMinimoInscritos(Long minInscritos) {
		return resultadoMesaRepository.buscarPorMinimoInscritos(minInscritos);
	}

	/**
	 * JPQL QUERY - Suma inscritos por departamento
	 */
	@Transactional(readOnly = true)
	public List<Object[]> sumarInscritosPorDepartamento() {
		return resultadoMesaRepository.sumarInscritosPorDepartamento();
	}

	/**
	 * NATIVE QUERY - Busca por votos válidos mínimos
	 */
	@Transactional(readOnly = true)
	public List<ResultadoMesa> buscarPorVotosValidosMinimos(Long minVotos) {
		return resultadoMesaRepository.buscarPorVotosValidosMinimos(minVotos);
	}

	/**
	 * NATIVE QUERY - Cuenta mesas por departamento
	 */
	@Transactional(readOnly = true)
	public List<Object[]> contarMesasPorDepartamento() {
		return resultadoMesaRepository.contarMesasPorDepartamento();
	}

	// ========================================
	// ESTADÍSTICAS (lógica de negocio)
	// ========================================

	@Transactional(readOnly = true)
	public List<EstadisticaDto> estadisticasPorDepartamento() {
		List<ResultadoMesa> todos = resultadoMesaRepository.findAll();
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

	private EstadisticaDto calcularEstadistica(String departamento, List<ResultadoMesa> lista) {
		long inscritos = lista.stream().mapToLong(ResultadoMesa::getInscritos).sum();
		long validosP = lista.stream().mapToLong(ResultadoMesa::getVotosValidosPresencial).sum();
		long nulosP = lista.stream().mapToLong(ResultadoMesa::getVotosNulosPresencial).sum();
		long blancosP = lista.stream().mapToLong(ResultadoMesa::getVotosBlancosPresencial).sum();
		long validosW = lista.stream().mapToLong(ResultadoMesa::getVotosValidosWeb).sum();
		long nulosW = lista.stream().mapToLong(ResultadoMesa::getVotosNulosWeb).sum();
		long blancosW = lista.stream().mapToLong(ResultadoMesa::getVotosBlancosWeb).sum();
		
		long totalValidos = validosP + validosW;
		long totalNulos = nulosP + nulosW;
		long totalBlancos = blancosP + blancosW;
		long totalEmitidos = totalValidos + totalNulos + totalBlancos;
		double participacion = inscritos > 0 ? (totalEmitidos * 100.0) / inscritos : 0.0;
		
		EstadisticaDto dto = new EstadisticaDto(departamento, inscritos, totalValidos, totalNulos, totalBlancos, participacion);
		dto.setVotosValidosPresencial(validosP);
		dto.setVotosNulosPresencial(nulosP);
		dto.setVotosBlancosPresencial(blancosP);
		dto.setVotosValidosWeb(validosW);
		dto.setVotosNulosWeb(nulosW);
		dto.setVotosBlancosWeb(blancosW);
		return dto;
	}
}
