import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTokenByRole } from '../services/keycloakService';

/**
 * Componente de ejemplo para demostrar cómo usar el servicio de Keycloak
 * Este componente puede servir como referencia para implementar la funcionalidad
 */
const KeycloakTokenExample = () => {
    const { loginWithKeycloak, keycloakToken, hasActiveSession } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Función de ejemplo para obtener token por rol
     */
    const handleGetToken = async (role) => {
        setLoading(true);
        setError(null);

        try {
            // Opción 1: Usar el servicio directamente
            const tokenData = await getTokenByRole(role);
            console.log('Token obtenido:', tokenData);
            alert(`Token obtenido exitosamente para rol: ${role}`);

            // Opción 2: Usar loginWithKeycloak del contexto
            // await loginWithKeycloak(role);

        } catch (err) {
            setError(err.message || 'Error al obtener token');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Gestión de Tokens de Keycloak</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>Estado de Sesión</h3>
                <p>
                    <strong>Sesión Activa:</strong> {hasActiveSession ? 'Sí' : 'No'}
                </p>
                {keycloakToken && (
                    <div>
                        <p><strong>Rol:</strong> {keycloakToken.role}</p>
                        <p><strong>Usuario:</strong> {keycloakToken.username}</p>
                        <p><strong>Expira en:</strong> {keycloakToken.expiresIn} segundos</p>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => handleGetToken('USER')}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    Obtener Token USER
                </button>

                <button
                    onClick={() => handleGetToken('AUDITOR')}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    Obtener Token AUDITOR
                </button>

                <button
                    onClick={() => handleGetToken('ADMIN')}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    Obtener Token ADMIN
                </button>
            </div>

            {loading && <p style={{ color: '#666' }}>Obteniendo token...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <h3>Instrucciones de Uso</h3>
                <ol>
                    <li>Asegúrate de que Docker esté ejecutando todos los servicios (Keycloak, Gateway, etc.)</li>
                    <li>Haz clic en uno de los botones para obtener un token según el rol</li>
                    <li>El token se guardará automáticamente en localStorage</li>
                    <li>Todas las llamadas a la API usarán este token automáticamente</li>
                </ol>
            </div>
        </div>
    );
};

export default KeycloakTokenExample;
