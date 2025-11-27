// Servicio de gestión de usuarios - Integración con MongoDB

// URL base de la API
const API_BASE_URL = 'http://localhost:5000/api/usuarios';

// Obtener usuarios del rol especificado
export const getUsersByRole = async (rol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}`);
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    const data = await response.json();
    return data.usuarios || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Obtener usuario por ID
export const getUserById = async (id, rol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}/${id}`);
    if (!response.ok) {
      throw new Error('Usuario no encontrado');
    }
    const data = await response.json();
    return data.usuario;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Crear nuevo usuario
export const createUser = async (rol, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        rol: rol,
        haVotado: false,
        estado: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear usuario');
    }

    const data = await response.json();
    return data.usuario;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async (id, rol, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar usuario');
    }

    const data = await response.json();
    return data.usuario;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Cambiar estado de usuario (activar/desactivar)
export const toggleUserStatus = async (id, rol) => {
  try {
    const usuarioActual = await getUserById(id, rol);
    const response = await fetch(`${API_BASE_URL}/${rol}/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estado: !usuarioActual.estado
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al cambiar estado');
    }

    const data = await response.json();
    return data.usuario;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (id, rol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar usuario');
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Procesar archivo CSV y cargarlo al backend
export const procesarCSV = async (contenido, rol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: contenido
    });

    const data = await response.json();

    return {
      exito: data.exito,
      usuariosAgregados: data.usuariosImportados || 0,
      usuariosProcesados: data.totalProcesados || 0,
      errores: data.errores || []
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      exito: false,
      errores: ['Error al procesar CSV: ' + error.message],
      usuariosAgregados: 0,
      usuariosProcesados: 0
    };
  }
};

// Descargar plantilla CSV
export const descargarPlantillaCSV = (rol) => {
  const contenido = 'nombre,carnet,fechaNacimiento,correo\nEjemplo,8812438,08/06/2004,ejemplo@votoseguro.bo\n';
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `plantilla-${rol}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Exportar usuarios a CSV
export const exportarUsuariosCSV = async (rol) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${rol}/export`, {
      headers: {
        'Accept': 'text/csv'
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar usuarios');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios-${rol}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
