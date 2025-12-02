import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import api from "../services/api";

function Usuarios() {
  const { keycloak, initialized } = useKeycloak();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      fetchUsuarios();
    }
  }, [initialized, keycloak.authenticated]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      console.log("📡 Llamando a /api/usuarios...");
      const response = await api.get("/api/usuarios");
      console.log("✅ Respuesta recibida:", response.data);
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
      setError(
        err.response?.data?.message || err.message || "Error al cargar usuarios"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Inicializando Keycloak...</div>
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
          <p className="mb-4 text-gray-600">
            Debes iniciar sesión con Keycloak para ver los usuarios
          </p>
          <button
            onClick={() => keycloak.login()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            🔐 Iniciar Sesión con Keycloak
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-3xl font-bold text-gray-800">
              👥 Gestión de Usuarios
            </h1>
            <div className="flex gap-4 items-center">
              <div className="text-sm bg-gray-50 px-4 py-2 rounded">
                <span className="text-gray-600">Usuario:</span>{" "}
                <span className="font-semibold">
                  {keycloak.tokenParsed?.preferred_username}
                </span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {keycloak.tokenParsed?.realm_access?.roles.includes("ADMIN")
                    ? "⭐ ADMIN"
                    : "👤 USER"}
                </span>
              </div>
              <button
                onClick={() => keycloak.logout()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                ← Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando usuarios...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">Error:</strong> {error}
            </div>
          )}

          {/* Success State - Table */}
          {!loading && !error && (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Total de usuarios: <strong>{usuarios.length}</strong>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre Completo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {usuario.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombreCompleto ||
                              `${usuario.nombre} ${usuario.apellido}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.correoElectronico || usuario.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {usuario.carnet || usuario.ci || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              usuario.correoVerificado || usuario.verificado
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {usuario.correoVerificado || usuario.verificado
                              ? "✓ Verificado"
                              : "⏳ Pendiente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && usuarios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay usuarios registrados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Usuarios;
