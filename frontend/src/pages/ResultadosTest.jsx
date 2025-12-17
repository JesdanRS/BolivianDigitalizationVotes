import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

function ResultadosTest() {
    const { keycloak, initialized } = useKeycloak();

    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const callApi = async () => {
        if (!initialized || !keycloak?.token) {
            console.warn('No hay token todavía');
            return;
        }

        setCargando(true);
        setError(null);

        try {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 800));

            // Datos fake basados en ResultadoMesaDto
            const datosFake = [
                {
                    id: 1,
                    departamento: 'La Paz',
                    municipio: 'La Paz',
                    recinto: 'Colegio Bolívar',
                    mesa: 'Mesa 001',
                    inscritos: 300,
                    votosValidosPresencial: 180,
                    votosNulosPresencial: 12,
                    votosBlancosPresencial: 8,
                    votosValidosWeb: 45,
                    votosNulosWeb: 3,
                    votosBlancosWeb: 2,
                    registradoEn: '2025-12-01T14:30:00Z',
                    actualizadoEn: '2025-12-01T14:30:00Z'
                },
                {
                    id: 2,
                    departamento: 'Santa Cruz',
                    municipio: 'Santa Cruz de la Sierra',
                    recinto: 'Unidad Educativa San Ignacio',
                    mesa: 'Mesa 002',
                    inscritos: 280,
                    votosValidosPresencial: 165,
                    votosNulosPresencial: 15,
                    votosBlancosPresencial: 10,
                    votosValidosWeb: 38,
                    votosNulosWeb: 5,
                    votosBlancosWeb: 3,
                    registradoEn: '2025-12-01T14:25:00Z',
                    actualizadoEn: '2025-12-01T14:25:00Z'
                },
                {
                    id: 3,
                    departamento: 'Cochabamba',
                    municipio: 'Cochabamba',
                    recinto: 'Colegio San Agustín',
                    mesa: 'Mesa 003',
                    inscritos: 320,
                    votosValidosPresencial: 195,
                    votosNulosPresencial: 18,
                    votosBlancosPresencial: 7,
                    votosValidosWeb: 52,
                    votosNulosWeb: 4,
                    votosBlancosWeb: 4,
                    registradoEn: '2025-12-01T14:35:00Z',
                    actualizadoEn: '2025-12-01T14:35:00Z'
                },
                {
                    id: 4,
                    departamento: 'La Paz',
                    municipio: 'El Alto',
                    recinto: 'Unidad Educativa Franz Tamayo',
                    mesa: 'Mesa 004',
                    inscritos: 290,
                    votosValidosPresencial: 175,
                    votosNulosPresencial: 14,
                    votosBlancosPresencial: 6,
                    votosValidosWeb: 42,
                    votosNulosWeb: 2,
                    votosBlancosWeb: 5,
                    registradoEn: '2025-12-01T14:40:00Z',
                    actualizadoEn: '2025-12-01T14:40:00Z'
                },
                {
                    id: 5,
                    departamento: 'Tarija',
                    municipio: 'Tarija',
                    recinto: 'Colegio Nacional Tarija',
                    mesa: 'Mesa 005',
                    inscritos: 250,
                    votosValidosPresencial: 145,
                    votosNulosPresencial: 10,
                    votosBlancosPresencial: 5,
                    votosValidosWeb: 35,
                    votosNulosWeb: 3,
                    votosBlancosWeb: 2,
                    registradoEn: '2025-12-01T14:20:00Z',
                    actualizadoEn: '2025-12-01T14:20:00Z'
                }
            ];

            console.log('Datos fake cargados:', datosFake);
            setResultados(datosFake);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleString('es-BO');
    };

    const calcularTotal = (resultado) => {
        return (
            resultado.votosValidosPresencial + resultado.votosNulosPresencial + resultado.votosBlancosPresencial +
            resultado.votosValidosWeb + resultado.votosNulosWeb + resultado.votosBlancosWeb
        );
    };

    return (
        <div style={{ padding: '16px' }}>
            <h2>🧪 Prueba Resultados Electoral (Datos de Prueba)</h2>
            <p>Endpoint simulado: GET /api/resultados/resultados</p>
            <p>Rol requerido: AUDITOR o ADMIN</p>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '16px' }}>
                ℹ️ Esta página muestra datos de ejemplo para probar la interfaz sin depender del backend.
            </p>

            <button
                onClick={callApi}
                disabled={cargando}
                style={{
                    padding: '10px 20px',
                    backgroundColor: cargando ? '#ccc' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: cargando ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                }}
            >
                {cargando ? 'Cargando...' : '🎲 Mostrar Datos de Prueba'}
            </button>

            {error && (
                <p style={{ color: 'red', marginTop: '8px' }}>
                    Error: {error}
                </p>
            )}

            {resultados.length > 0 && (
                <table
                    style={{
                        marginTop: '16px',
                        borderCollapse: 'collapse',
                        width: '100%',
                        fontSize: '0.85rem',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>Departamento</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>Municipio</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>Recinto</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>Mesa</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>Inscritos</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#e8f5e9' }}>Válidos (P)</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#ffebee' }}>Nulos (P)</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#fff3e0' }}>Blancos (P)</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#e3f2fd' }}>Válidos (W)</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#fce4ec' }}>Nulos (W)</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#fff9c4' }}>Blancos (W)</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Total</th>
                            <th style={{ border: '1px solid #ccc', padding: '4px', backgroundColor: '#f0f0f0' }}>Registrado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((res) => (
                            <tr key={res.id}>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center' }}>{res.id}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px' }}>{res.departamento}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px' }}>{res.municipio}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px' }}>{res.recinto}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center' }}>{res.mesa}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center' }}>{res.inscritos}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', backgroundColor: '#f1f8f4' }}>{res.votosValidosPresencial}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', backgroundColor: '#fef5f5' }}>{res.votosNulosPresencial}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', backgroundColor: '#fffaf2' }}>{res.votosBlancosPresencial}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', backgroundColor: '#f2f7fd' }}>{res.votosValidosWeb}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', backgroundColor: '#fef0f4' }}>{res.votosNulosWeb}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', backgroundColor: '#fffef0' }}>{res.votosBlancosWeb}</td>
                                <td style={{ border: '1px solid #eee', padding: '4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                    {calcularTotal(res)}
                                </td>
                                <td style={{ border: '1px solid #eee', padding: '4px', fontSize: '0.8em' }}>
                                    {formatearFecha(res.registradoEn)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {resultados.length === 0 && !cargando && !error && (
                <div style={{
                    marginTop: '20px',
                    padding: '30px',
                    backgroundColor: '#f8f9fa',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, color: '#6c757d' }}>
                        📋 Haz clic en el botón para cargar datos de prueba
                    </p>
                </div>
            )}

            {resultados.length > 0 && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                    <p><strong>📊 Total de mesas cargadas:</strong> {resultados.length}</p>
                    <p><strong>🔑 Token actual:</strong> {keycloak?.token ? 'Presente ✓' : 'No disponible'}</p>
                    <p><strong>👤 Usuario:</strong> {keycloak?.tokenParsed?.preferred_username || 'Desconocido'}</p>
                    <p><strong>🎭 Roles:</strong> {keycloak?.tokenParsed?.realm_access?.roles?.join(', ') || 'Sin roles'}</p>

                </div>
            )}
        </div>
    );
}

export default ResultadosTest;
