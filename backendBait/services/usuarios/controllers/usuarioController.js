// services/usuarios/controllers/usuarioController.js
// Controlador para gestionar usuarios con múltiples colecciones
// - administradors: para jurados y administradores
// - votantes: para población

const Administrador = require('../../../models/Administrador');
const Jurado = require('../../../models/Jurado');
const Poblacion = require('../../../models/Poblacion');

// Mapeo de modelos según el rol
const modelosPorRol = {
  poblacion: Poblacion,
  jurados: Jurado,
  administradores: Administrador
};

// Función auxiliar para obtener el modelo correcto
const obtenerModelo = (rol) => {
  const modelo = modelosPorRol[rol];
  if (!modelo) {
    throw new Error(`Rol inválido: ${rol}. Debe ser: poblacion, jurados, administradores`);
  }
  return modelo;
};

/**
 * Obtener usuarios por rol
 * GET /api/usuarios/:rol
 */
exports.obtenerUsuariosPorRol = async (req, res) => {
  try {
    const { rol } = req.params;
    const { estado, pagina = 1, limite = 10 } = req.query;

    const Modelo = obtenerModelo(rol);
    const filtro = {};

    if (estado !== undefined) {
      filtro.estado = estado === 'true';
    }

    // Filtrar por role para jurados y administradores (están en la misma colección)
    if (rol === 'jurados') {
      filtro.role = 'jurado';
    } else if (rol === 'administradores') {
      filtro.role = { $in: ['admin', 'administrador'] };
    }

    const skip = (pagina - 1) * limite;
    const usuarios = await Modelo.find(filtro)
      .skip(skip)
      .limit(parseInt(limite))
      .sort({ createdAt: -1 });

    const total = await Modelo.countDocuments(filtro);

    res.status(200).json({
      exito: true,
      cantidad: usuarios.length,
      total,
      pagina: parseInt(pagina),
      usuarios: usuarios.map(u => ({
        id: u._id,
        nombre: u.nombre,
        carnet: u.carnet,
        fechaNacimiento: u.fechaNacimiento,
        correo: u.correo,
        haVotado: u.haVotado,
        estado: u.estado,
        role: u.role
      }))
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:rol/:id
 */
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { rol, id } = req.params;
    const Modelo = obtenerModelo(rol);

    const usuario = await Modelo.findById(id);
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      exito: true,
      usuario: usuario.toDTO()
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Obtener usuario por carnet
 * GET /api/usuarios/:rol/carnet/:carnet
 */
exports.obtenerPorCarnet = async (req, res) => {
  try {
    const { rol, carnet } = req.params;
    const Modelo = obtenerModelo(rol);

    const usuario = await Modelo.findOne({ carnet });
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      exito: true,
      usuario: usuario.toDTO()
    });
  } catch (error) {
    console.error('Error al obtener usuario por carnet:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Crear usuario
 * POST /api/usuarios/:rol
 */
exports.crearUsuario = async (req, res) => {
  try {
    const { rol } = req.params;
    const { nombre, carnet, fechaNacimiento, correo, password } = req.body;

    // Validaciones
    if (!nombre || !carnet || !fechaNacimiento || !correo) {
      return res.status(400).json({
        exito: false,
        error: 'Faltan campos requeridos: nombre, carnet, fechaNacimiento, correo'
      });
    }

    // Password ya no es requerido en el body, se genera automáticamente si falta
    // if ((rol === 'jurados' || rol === 'administradores') && !password) { ... }

    const Modelo = obtenerModelo(rol);

    // Verificar duplicados
    const existente = await Modelo.findOne({
      $or: [{ carnet }, { correo: correo.toLowerCase() }]
    });

    if (existente) {
      return res.status(409).json({
        exito: false,
        error: existente.carnet === carnet ? 'El carnet ya existe' : 'El correo ya está registrado'
      });
    }

    // Crear nuevo usuario
    const usuarioData = {
      nombre: nombre.trim(),
      carnet: carnet.trim(),
      fechaNacimiento: fechaNacimiento.trim(),
      correo: correo.toLowerCase().trim(),
      haVotado: false,
      estado: true
    };

    // Agregar password si es necesario (default: carnet)
    if ((rol === 'jurados' || rol === 'administradores')) {
      usuarioData.password = password || carnet;
    }

    const usuario = new Modelo(usuarioData);
    await usuario.save();

    res.status(201).json({
      exito: true,
      usuario: usuario.toDTO(),
      mensaje: 'Usuario creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Actualizar usuario
 * PUT /api/usuarios/:rol/:id
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const { rol, id } = req.params;
    const { nombre, carnet, fechaNacimiento, correo } = req.body;

    const Modelo = obtenerModelo(rol);
    const usuario = await Modelo.findById(id);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar duplicados de carnet y correo
    if (carnet && carnet !== usuario.carnet) {
      const existente = await Modelo.findOne({ carnet });
      if (existente) {
        return res.status(409).json({
          exito: false,
          error: 'El carnet ya está registrado'
        });
      }
    }

    if (correo && correo.toLowerCase() !== usuario.correo) {
      const existente = await Modelo.findOne({ correo: correo.toLowerCase() });
      if (existente) {
        return res.status(409).json({
          exito: false,
          error: 'El correo ya está registrado'
        });
      }
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre.trim();
    if (carnet) usuario.carnet = carnet.trim();
    if (fechaNacimiento) usuario.fechaNacimiento = fechaNacimiento.trim();
    if (correo) usuario.correo = correo.toLowerCase().trim();

    await usuario.save();

    res.status(200).json({
      exito: true,
      usuario: usuario.toDTO(),
      mensaje: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Cambiar estado usuario
 * PATCH /api/usuarios/:rol/:id/estado
 */
exports.cambiarEstadoUsuario = async (req, res) => {
  try {
    const { rol, id } = req.params;
    const { estado } = req.body;

    if (estado === undefined) {
      return res.status(400).json({
        exito: false,
        error: 'El campo estado es requerido'
      });
    }

    const Modelo = obtenerModelo(rol);
    const usuario = await Modelo.findById(id);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: 'Usuario no encontrado'
      });
    }

    await usuario.cambiarEstado(estado);

    res.status(200).json({
      exito: true,
      usuario: usuario.toDTO(),
      mensaje: `Usuario ${estado ? 'activado' : 'desactivado'} exitosamente`
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Marcar usuario como votado
 * PATCH /api/usuarios/:rol/:id/votar
 */
exports.marcarComoVotado = async (req, res) => {
  try {
    const { rol, id } = req.params;
    const Modelo = obtenerModelo(rol);

    const usuario = await Modelo.findById(id);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: 'Usuario no encontrado'
      });
    }

    if (usuario.haVotado) {
      return res.status(400).json({
        exito: false,
        error: 'El usuario ya ha votado'
      });
    }

    await usuario.marcarComoVotado();

    res.status(200).json({
      exito: true,
      usuario: usuario.toDTO(),
      mensaje: 'Usuario marcado como votado exitosamente'
    });
  } catch (error) {
    console.error('Error al marcar como votado:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Eliminar usuario
 * DELETE /api/usuarios/:rol/:id
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const { rol, id } = req.params;
    const Modelo = obtenerModelo(rol);

    const usuario = await Modelo.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      exito: true,
      mensaje: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Importar usuarios desde CSV
 * POST /api/usuarios/:rol/import
 */
exports.importarCSV = async (req, res) => {
  try {
    const { rol } = req.params;
    const csvData = req.body;

    const Modelo = obtenerModelo(rol);

    if (!csvData) {
      return res.status(400).json({
        exito: false,
        error: 'El contenido del CSV es requerido'
      });
    }

    // Parsear CSV manualmente
    const lineas = csvData.split('\n').filter(linea => linea.trim());
    if (lineas.length === 0) {
      return res.status(400).json({
        exito: false,
        error: 'El CSV está vacío'
      });
    }

    // Detectar header
    const primeraLinea = lineas[0].toLowerCase();
    const tieneHeader = primeraLinea.includes('nombre') && primeraLinea.includes('carnet');
    const inicio = tieneHeader ? 1 : 0;

    const usuariosImportados = [];
    const errores = [];

    // Procesar cada fila
    for (let i = inicio; i < lineas.length; i++) {
      try {
        const campos = lineas[i].split(',').map(c => c.trim());

        if (campos.length < 4) {
          errores.push({
            fila: i + 1,
            razon: 'Faltan campos (se requieren: nombre, carnet, fechaNacimiento, correo)'
          });
          continue;
        }

        const [nombre, carnet, fechaNacimiento, correo] = campos;

        // Validar campos no vacíos
        if (!nombre || !carnet || !fechaNacimiento || !correo) {
          errores.push({
            fila: i + 1,
            razon: 'Campos vacíos no permitidos'
          });
          continue;
        }

        // Verificar duplicados en BD
        const existente = await Modelo.findOne({
          $or: [{ carnet: carnet.trim() }, { correo: correo.toLowerCase().trim() }]
        });

        if (existente) {
          errores.push({
            fila: i + 1,
            razon: 'Carnet o correo duplicado en BD'
          });
          continue;
        }

        // Crear usuario
        const usuarioData = {
          nombre: nombre.trim(),
          carnet: carnet.trim(),
          fechaNacimiento: fechaNacimiento.trim(),
          correo: correo.toLowerCase().trim(),
          haVotado: false,
          estado: true
        };

        // Agregar password genérico si es necesario
        if (rol === 'jurados' || rol === 'administradores') {
          usuarioData.password = 'temporal123'; // Se recomienda cambiar después
        }

        const usuario = new Modelo(usuarioData);
        await usuario.save();
        usuariosImportados.push(usuario.toDTO());
      } catch (error) {
        errores.push({
          fila: i + 1,
          razon: error.message
        });
      }
    }

    res.status(200).json({
      exito: usuariosImportados.length > 0,
      usuariosImportados: usuariosImportados.length,
      totalProcesados: lineas.length - inicio,
      errores: errores.length > 0 ? errores : null,
      usuarios: usuariosImportados,
      mensaje: `${usuariosImportados.length} de ${lineas.length - inicio} usuarios importados exitosamente`
    });
  } catch (error) {
    console.error('Error al importar CSV:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Exportar usuarios a CSV
 * GET /api/usuarios/:rol/export
 */
exports.exportarUsuarios = async (req, res) => {
  try {
    const { rol } = req.params;
    const { estado } = req.query;

    const Modelo = obtenerModelo(rol);
    const filtro = {};

    if (estado !== undefined) {
      filtro.estado = estado === 'true';
    }

    const usuarios = await Modelo.find(filtro).sort({ nombre: 1 });

    if (usuarios.length === 0) {
      return res.status(404).json({
        exito: false,
        error: 'No hay usuarios para exportar'
      });
    }

    // Crear CSV manualmente
    const headers = ['nombre', 'carnet', 'fechaNacimiento', 'correo', 'haVotado', 'estado'];
    let csv = headers.join(',') + '\n';

    usuarios.forEach(u => {
      const fila = [
        `"${u.nombre}"`,
        u.carnet,
        u.fechaNacimiento,
        u.correo,
        u.haVotado ? 'Sí' : 'No',
        u.estado ? 'Activo' : 'Inactivo'
      ].join(',');
      csv += fila + '\n';
    });

    // Enviar como descarga
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="usuarios_${rol}_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error al exportar usuarios:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de usuarios
 * GET /api/usuarios/:rol/estadisticas
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { rol } = req.params;
    const Modelo = obtenerModelo(rol);

    const filtro = {};

    // Filtrar por role para jurados y administradores
    if (rol === 'jurados') {
      filtro.role = 'jurado';
    } else if (rol === 'administradores') {
      filtro.role = { $in: ['admin', 'administrador'] };
    }

    const total = await Modelo.countDocuments(filtro);
    const activos = await Modelo.countDocuments({ ...filtro, estado: true });
    const inactivos = await Modelo.countDocuments({ ...filtro, estado: false });
    const hanVotado = await Modelo.countDocuments({ ...filtro, haVotado: true });
    const noHanVotado = await Modelo.countDocuments({ ...filtro, haVotado: false });

    res.status(200).json({
      exito: true,
      estadisticas: {
        rol,
        total,
        activos,
        inactivos,
        hanVotado,
        noHanVotado,
        porcentajeVotacion: total > 0 ? ((hanVotado / total) * 100).toFixed(2) : 0,
        porcentajeActividad: total > 0 ? ((activos / total) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(400).json({
      exito: false,
      error: error.message
    });
  }
};
