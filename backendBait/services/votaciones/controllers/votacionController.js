// controllers/votacionController.js
// Controlador para la lógica de negocio de votaciones

const Candidato = require('../models/Candidato');
const Voto = require('../models/Voto');

/**
 * Obtener todos los candidatos activos
 */
const obtenerCandidatos = async (req, res) => {
    try {
        const candidatos = await Candidato.find({ activo: true })
            .select('-__v')
            .sort({ nombre: 1 });

        res.status(200).json({
            success: true,
            count: candidatos.length,
            data: candidatos
        });
    } catch (error) {
        console.error('Error al obtener candidatos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los candidatos',
            error: error.message
        });
    }
};

/**
 * Obtener un candidato por ID
 */
const obtenerCandidatoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const candidato = await Candidato.findById(id);

        if (!candidato) {
            return res.status(404).json({
                success: false,
                message: 'Candidato no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: candidato
        });
    } catch (error) {
        console.error('Error al obtener candidato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el candidato',
            error: error.message
        });
    }
};

/**
 * Registrar un voto
 */
const registrarVoto = async (req, res) => {
    try {
        const { candidatoId } = req.body;

        // Validar que se envió el ID del candidato
        if (!candidatoId) {
            return res.status(400).json({
                success: false,
                message: 'El ID del candidato es requerido'
            });
        }

        // Buscar el candidato
        const candidato = await Candidato.findById(candidatoId);

        if (!candidato) {
            return res.status(404).json({
                success: false,
                message: 'Candidato no encontrado'
            });
        }

        if (!candidato.activo) {
            return res.status(400).json({
                success: false,
                message: 'El candidato no está activo'
            });
        }

        // Registrar el voto
        const nuevoVoto = new Voto({
            candidatoId: candidato._id,
            candidatoNombre: candidato.nombre,
            ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('user-agent') || 'unknown'
        });

        await nuevoVoto.save();

        // Incrementar contador de votos del candidato
        await candidato.incrementarVoto();

        res.status(201).json({
            success: true,
            message: `Voto registrado exitosamente para ${candidato.nombre}`,
            data: {
                candidato: candidato.nombre,
                totalVotos: candidato.votos + 1,
                timestamp: nuevoVoto.fechaVoto
            }
        });
    } catch (error) {
        console.error('Error al registrar voto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el voto',
            error: error.message
        });
    }
};

/**
 * Obtener resultados de votación
 */
const obtenerResultados = async (req, res) => {
    try {
        const candidatos = await Candidato.find({ activo: true })
            .select('nombre partido votos')
            .sort({ votos: -1 });

        const totalVotos = candidatos.reduce((sum, c) => sum + c.votos, 0);

        const resultados = candidatos.map(candidato => ({
            id: candidato._id,
            nombre: candidato.nombre,
            partido: candidato.partido,
            votos: candidato.votos,
            porcentaje: totalVotos > 0 ? ((candidato.votos / totalVotos) * 100).toFixed(2) : 0
        }));

        res.status(200).json({
            success: true,
            totalVotos,
            data: resultados
        });
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los resultados',
            error: error.message
        });
    }
};

/**
 * Obtener estadísticas de votación
 */
const obtenerEstadisticas = async (req, res) => {
    try {
        const totalCandidatos = await Candidato.countDocuments({ activo: true });
        const totalVotos = await Voto.countDocuments({ validado: true });
        const totalVotosNulos = await Voto.countDocuments({ validado: false });
        const candidatoLider = await Candidato.findOne({ activo: true }).sort({ votos: -1 });

        // Obtener todos los candidatos con sus votos
        const candidatos = await Candidato.find({ activo: true })
            .select('nombre votos')
            .sort({ votos: -1 });

        // Calcular total de votos válidos (suma de votos de todos los candidatos)
        const totalVotosValidos = candidatos.reduce((sum, c) => sum + c.votos, 0);

        // Simular mesas escrutadas (puedes ajustar esto según tu lógica)
        const mesasTotal = 1560;
        const mesasEscrutadas = Math.min(mesasTotal, Math.floor((totalVotos / 10) + 50));

        // Calcular participación (simulada como porcentaje)
        const votantesEsperados = mesasTotal * 10; // ~10 votos por mesa esperados
        const participacion = ((totalVotos / votantesEsperados) * 100).toFixed(1);

        res.status(200).json({
            success: true,
            data: {
                totalCandidatos,
                totalVotos,
                votosValidos: totalVotosValidos,
                votosNulos: totalVotosNulos,
                participacion: parseFloat(participacion),
                mesasEscrutadas,
                mesasTotal,
                candidatoLider: candidatoLider ? {
                    nombre: candidatoLider.nombre,
                    votos: candidatoLider.votos
                } : null,
                distribucionVotos: candidatos.map(c => ({
                    nombre: c.nombre,
                    votos: c.votos,
                    porcentaje: totalVotosValidos > 0 ?
                        ((c.votos / totalVotosValidos) * 100).toFixed(2) : 0
                }))
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCandidatos,
    obtenerCandidatoPorId,
    registrarVoto,
    obtenerResultados,
    obtenerEstadisticas
};
