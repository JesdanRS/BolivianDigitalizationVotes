import { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';
import CandidateModal from './components/CandidateModal';
import './index.css';

const API_URL = 'http://localhost:8080/ms-candidatos/api/candidatos';

function App() {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const kc = new Keycloak({
      url: 'http://localhost:8090',
      realm: 'votaciones',
      clientId: 'votaciones-app'
    });

    kc.init({ onLoad: 'check-sso' }).then(auth => {
      setKeycloak(kc);
      setAuthenticated(auth);
      if (auth) {
        console.log("🔑 TU TOKEN PARA POSTMAN:", kc.token);
        fetchCandidates(kc.token);
      }
    }).catch(console.error);
  }, []);

  const fetchCandidates = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      } else {
        alert("Error cargando candidatos");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCandidate(null);
    setModalOpen(true);
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    const method = editingCandidate ? 'PUT' : 'POST';
    const url = editingCandidate ? `${API_URL}/${editingCandidate.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCandidates(keycloak.token);
        alert(editingCandidate ? 'Actualizado!' : 'Creado!');
      } else {
        const txt = await res.text();
        alert('Error: ' + txt);
      }
    } catch (err) {
      alert('Error de red');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro de eliminar?")) return;
    const ci = prompt("Confirma tu CI para auditoría:", "123456");
    if (!ci) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ciUsuario: ci })
      });
      if (res.ok) {
        fetchCandidates(keycloak.token);
      } else {
        alert("No se pudo eliminar");
      }
    } catch (err) {
      alert("Error de red");
    }
  };

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();

  if (!keycloak) return <div className="loading-spinner">Inicializando Keycloak...</div>;

  if (!authenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1 style={{ fontSize: '3em' }}>🗳️</h1>
        <h1>Sistema Electoral Bolivia</h1>
        <p>Acceso Seguro</p>
        <button className="btn-primary" style={{ fontSize: '1.2em', padding: '15px 30px' }} onClick={login}>
          🔐 Iniciar Sesión
        </button>
      </div>
    );
  }

  const isAdmin = keycloak.realmAccess?.roles?.includes('admin');

  return (
    <>
      <div className="flag-strip">
        <div className="flag-red"></div>
        <div className="flag-yellow"></div>
        <div className="flag-green"></div>
      </div>

      <div className="container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0 }}>Gestión de Candidatos</h1>
            <small style={{ color: '#666' }}>Panel Administrativo 2025</small>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Hola, <strong>{keycloak.tokenParsed?.preferred_username}</strong></div>
            <div style={{ fontSize: '0.8em', color: '#888' }}>{isAdmin ? 'ADMINISTRADOR' : 'USUARIO'}</div>
            <button onClick={logout} className="btn-sm btn-danger" style={{ marginTop: '5px' }}>Salir</button>
          </div>
        </header>

        <div className="actions-bar">
          <button onClick={handleCreate} className="btn-primary">+ Nuevo Candidato</button>
          <button onClick={() => fetchCandidates(keycloak.token)} className="btn-secondary">↻ Recargar</button>
        </div>

        {loading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Partido</th>
                <th>Presidente</th>
                <th>Vicepresidente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay registros.</td></tr>
              ) : (
                candidates.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td><strong>{c.partido}</strong></td>
                    <td>{c.nombreCompletoPresidente}<br /><small>{c.carnetPresidente}</small></td>
                    <td>{c.nombreCompletoVicepresidente}<br /><small>{c.carnetVicepresidente}</small></td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(c)} className="btn-sm btn-warning">Editar</button>
                        <button onClick={() => handleDelete(c.id)} className="btn-sm btn-danger">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <CandidateModal
          candidate={editingCandidate}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

export default App;
