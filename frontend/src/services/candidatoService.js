
const API_URL = 'http://localhost:8080/ms-candidatos/api/candidatos';

export const obtenerCandidatos = async (token) => {
    console.log("Fetching candidatos from:", API_URL);
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Response status:", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("Candidatos data:", data);
            return { success: true, data };
        }
        const text = await response.text();
        console.error("Fetch error:", text);
        return { success: false, error: 'Error al cargar candidatos: ' + response.status };
    } catch (error) {
        console.error("Network fatal error:", error);
        return { success: false, error: 'Error de conexión' };
    }
};

export const crearCandidato = async (candidato, token) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(candidato)
        });
        if (response.ok) {
            return { success: true };
        }
        const text = await response.text();
        return { success: false, error: text || 'Error al crear candidato' };
    } catch (error) {
        return { success: false, error: 'Error de conexión' };
    }
};

export const actualizarCandidato = async (id, candidato, token) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(candidato)
        });
        if (response.ok) {
            return { success: true };
        }
        return { success: false, error: 'Error al actualizar candidato' };
    } catch (error) {
        return { success: false, error: 'Error de conexión' };
    }
};

export const eliminarCandidato = async (id, token, ciUsuario = '123456') => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ciUsuario })
        });
        if (response.ok) {
            return { success: true };
        }
        return { success: false, error: 'Error al eliminar candidato' };
    } catch (error) {
        return { success: false, error: 'Error de conexión' };
    }
};
