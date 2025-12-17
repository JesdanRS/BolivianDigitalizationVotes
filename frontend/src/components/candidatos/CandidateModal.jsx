import React, { useState, useEffect } from 'react';

export default function CandidateModal({ candidate, onClose, onSave }) {
    const [formData, setFormData] = useState({
        partido: '',
        nombreCompletoPresidente: '',
        carnetPresidente: '',
        fechaNacimientoPresidente: '',
        nombreCompletoVicepresidente: '',
        carnetVicepresidente: '',
        fechaNacimientoVicepresidente: '',
        correoElectronico: '',
        descripcion: '',
        ciUsuario: '123456' // Default para auditoría
    });

    useEffect(() => {
        if (candidate) {
            setFormData({
                ...candidate,
                ciUsuario: '123456' // Mantener auditoría
            });
        }
    }, [candidate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
        }} onClick={onClose}>
            <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
                    {candidate ? 'Editar Candidato' : 'Nuevo Candidato'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Partido Político</label>
                            <input
                                type="text" name="partido" value={formData.partido} onChange={handleChange} required
                                placeholder="Ej: MAS, CC, CREEMOS"
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Nombre Presidente</label>
                            <input type="text" name="nombreCompletoPresidente" value={formData.nombreCompletoPresidente} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Carnet Presidente</label>
                            <input type="text" name="carnetPresidente" value={formData.carnetPresidente} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Fecha Nac. Presidente</label>
                            <input type="date" name="fechaNacimientoPresidente" value={formData.fechaNacimientoPresidente} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>

                        <div style={{ gridColumn: '1 / -1', height: '1px', background: '#e5e7eb', margin: '8px 0' }}></div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Nombre Vicepresidente</label>
                            <input type="text" name="nombreCompletoVicepresidente" value={formData.nombreCompletoVicepresidente} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Carnet Vicepresidente</label>
                            <input type="text" name="carnetVicepresidente" value={formData.carnetVicepresidente} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Fecha Nac. Vicepresidente</label>
                            <input type="date" name="fechaNacimientoVicepresidente" value={formData.fechaNacimientoVicepresidente} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Correo Electrónico</label>
                            <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} required
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Descripción / Propuesta</label>
                            <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }}></textarea>
                        </div>

                        <div style={{ gridColumn: '1 / -1', background: '#fffbeb', padding: '12px', borderRadius: '6px', border: '1px solid #fcd34d' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#92400e', marginBottom: '4px' }}>CI Usuario (Auditoría)</label>
                            <input type="text" name="ciUsuario" value={formData.ciUsuario} onChange={handleChange} required placeholder="CI de quien registra"
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fcd34d' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                            Cancelar
                        </button>
                        <button type="submit"
                            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
