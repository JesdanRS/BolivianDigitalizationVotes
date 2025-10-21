import React, { useState } from 'react';
import Button from '../components/common/Button';
import { Link, useLocation } from 'react-router-dom';
import imgPaz from '../assets/images/paz.png';
import imgTuto from '../assets/images/tuto.png';
import imgExample from '../assets/images/doria.jpeg';

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px'
      }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ marginBottom: '24px', color: '#4b5563' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#4b5563',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#dc2626',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Edición
const EditModal = ({ isOpen, onClose, onSave, candidato }) => {
  if (!isOpen || !candidato) return null;

  const [formData, setFormData] = useState({
    nombre: candidato.nombre,
    partido: candidato.partido
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...candidato, ...formData });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: 600 }}>Editar Candidato</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563' }}>Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563' }}>Partido</label>
            <input
              type="text"
              value={formData.partido}
              onChange={(e) => setFormData({ ...formData, partido: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#4b5563',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#dc2626',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NavItem = ({ to, label, icon }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} style={{
      padding: '10px 14px',
      borderRadius: 10,
      backgroundColor: active ? '#eef2ff' : 'transparent',
      color: active ? '#1f2937' : '#4b5563',
      textDecoration: 'none',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {icon}
      {label}
    </Link>
  );
};

const GestionCandidatos = () => {
  const [candidatos, setCandidatos] = useState([
    {
      id: 1,
      nombre: 'Jorge Tuto Quiroga',
      partido: 'Libre',
      foto: imgTuto
    },
    {
      id: 2,
      nombre: 'Rodrigo Paz',
      partido: 'Partido Demócrata Cristiano',
      foto: imgPaz
    },
    {
      id: 3,
      nombre: 'Samuel Doria Medina',
      partido: 'Unidad',
      foto: imgExample
    }
  ]);

  // Estados para los modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState(null);

  const handleEditar = (id) => {
    const candidato = candidatos.find(c => c.id === id);
    setSelectedCandidato(candidato);
    setShowEditModal(true);
  };

  const handleEliminar = (id) => {
    const candidato = candidatos.find(c => c.id === id);
    setSelectedCandidato(candidato);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCandidato) {
      setCandidatos(candidatos.filter(c => c.id !== selectedCandidato.id));
      setShowDeleteModal(false);
      setSelectedCandidato(null);
    }
  };

  const handleSaveEdit = (updatedCandidato) => {
    setCandidatos(candidatos.map(c => 
      c.id === updatedCandidato.id ? { ...c, ...updatedCandidato } : c
    ));
    setShowEditModal(false);
    setSelectedCandidato(null);
  };

  const handleAnadirCandidato = () => {
    const newCandidato = {
      id: candidatos.length + 1,
      nombre: 'Nuevo Candidato',
      partido: 'Partido Político',
      foto: imgExample
    };
    setCandidatos([...candidatos, newCandidato]);
  };

  return (
    <div style={{fontFamily:'Arial, sans-serif', background:'#f9fafb', minHeight:'100dvh', color:'#111'}}>
      {/* Barra de navegación superior */}
      <nav style={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        padding:'12px 24px',
        background:'#fff',
        borderBottom:'1px solid #e5e7eb',
        position:'sticky',
        top:0,
        zIndex:50
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{fontSize:'1.4rem', fontWeight:800, color:'#111'}}>VotoSeguro</div>
          <div style={{fontSize:12, color:'#6b7280', marginTop:2}}>· Administración</div>
        </div>

        <div style={{display:'flex', gap:6}}>
          <NavItem to="/gestionar-candidatos" label="Gestionar Candidatos" icon={<i className="fas fa-users"></i>} />
          <NavItem to="/cargar-votos" label="Cargar Votos" icon={<i className="fas fa-upload"></i>} />
          <NavItem to="/estadisticas" label="Estadísticas" icon={<i className="fas fa-chart-bar"></i>} />
        </div>

        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <span style={{fontSize:12, color:'#6b7280'}}>Administrador</span>
          <div style={{width:32, height:32, borderRadius:'50%', background:'#c7d2fe'}} />
        </div>
      </nav>

      {/* Contenido principal */}
      <div style={{padding:'24px 40px', width:'95%', maxWidth:'1400px', margin:'0 auto'}}>
        <h1 style={{fontSize:'1.8rem', fontWeight:800, marginBottom:16}}>Gestionar Candidatos</h1>
        <p style={{color:'#6b7280', marginBottom:24}}>
          Añade, edita o elimina candidatos para las elecciones.
        </p>

        <div style={{
          background:'#fff',
          borderRadius:'12px',
          boxShadow:'0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow:'hidden'
        }}>

          <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0}}>
            <thead>
              <tr style={{background:'#f8fafc'}}>
                <th style={{padding:'12px 24px', textAlign:'left', fontSize:'0.875rem', color:'#4b5563', fontWeight:600}}>Nombre</th>
                <th style={{padding:'12px 24px', textAlign:'left', fontSize:'0.875rem', color:'#4b5563', fontWeight:600}}>Partido</th>
                <th style={{padding:'12px 24px', textAlign:'left', fontSize:'0.875rem', color:'#4b5563', fontWeight:600}}>Foto</th>
                <th style={{padding:'12px 24px', textAlign:'right', fontSize:'0.875rem', color:'#4b5563', fontWeight:600}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {candidatos.map((candidato) => (
                <tr key={candidato.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:'16px 24px', fontSize:'0.875rem', color:'#111827'}}>{candidato.nombre}</td>
                  <td style={{padding:'16px 24px'}}>
                    <span style={{color:'#dc2626', fontSize:'0.875rem'}}>{candidato.partido}</span>
                  </td>
                  <td style={{padding:'16px 24px'}}>
                    <img
                      src={candidato.foto}
                      alt={candidato.nombre}
                      style={{
                        width:'40px',
                        height:'40px',
                        borderRadius:'50%',
                        objectFit:'cover',
                        border:'2px solid #e5e7eb'
                      }}
                    />
                  </td>
                  <td style={{padding:'16px 24px', textAlign:'right'}}>
                    <button
                      onClick={() => handleEditar(candidato.id)}
                      style={{
                        background:'none',
                        border:'none',
                        color:'#dc2626',
                        marginRight:'16px',
                        cursor:'pointer',
                        fontSize:'0.875rem',
                        padding:'4px 8px',
                        borderRadius:'4px',
                        transition:'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#fee2e2'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(candidato.id)}
                      style={{
                        background:'none',
                        border:'none',
                        color:'#dc2626',
                        cursor:'pointer',
                        fontSize:'0.875rem',
                        padding:'4px 8px',
                        borderRadius:'4px',
                        transition:'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#fee2e2'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{padding:'24px', borderTop:'1px solid #e5e7eb'}}>
            <button
              onClick={handleAnadirCandidato}
              style={{
                background:'#dc2626',
                color:'white',
                border:'none',
                padding:'10px 20px',
                borderRadius:'6px',
                cursor:'pointer',
                fontWeight:500,
                display:'flex',
                alignItems:'center',
                gap:'8px',
                transition:'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#b91c1c'}
              onMouseOut={(e) => e.target.style.background = '#dc2626'}
            >
              <span>+</span> Añadir Candidato
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Candidato"
        message={`¿Estás seguro que deseas eliminar a ${selectedCandidato?.nombre}? Esta acción no se puede deshacer.`}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        candidato={selectedCandidato}
      />
    </div>
  );
};

export default GestionCandidatos;