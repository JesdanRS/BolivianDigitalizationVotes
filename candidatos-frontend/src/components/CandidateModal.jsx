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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0 }}>{candidate ? 'Editar Candidato' : 'Nuevo Candidato'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="full-width">
                            <label>Partido Político</label>
                            <input type="text" name="partido" value={formData.partido} onChange={handleChange} required placeholder="Ej: MAS, CC, CREEMOS" />
                        </div>

                        <div>
                            <label>Nombre Presidente</label>
                            <input type="text" name="nombreCompletoPresidente" value={formData.nombreCompletoPresidente} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Carnet Presidente</label>
                            <input type="text" name="carnetPresidente" value={formData.carnetPresidente} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Fecha Nac. Presidente</label>
                            <input type="date" name="fechaNacimientoPresidente" value={formData.fechaNacimientoPresidente} onChange={handleChange} required />
                        </div>

                        <div></div>

                        <div>
                            <label>Nombre Vicepresidente</label>
                            <input type="text" name="nombreCompletoVicepresidente" value={formData.nombreCompletoVicepresidente} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Carnet Vicepresidente</label>
                            <input type="text" name="carnetVicepresidente" value={formData.carnetVicepresidente} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Fecha Nac. Vicepresidente</label>
                            <input type="date" name="fechaNacimientoVicepresidente" value={formData.fechaNacimientoVicepresidente} onChange={handleChange} required />
                        </div>

                        <div className="full-width">
                            <label>Correo Electrónico</label>
                            <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} required />
                        </div>

                        <div className="full-width">
                            <label>Descripción / Propuesta</label>
                            <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}></textarea>
                        </div>
                        
                        <div className="full-width" style={{ background: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
                            <label>CI Usuario (Auditoría)</label>
                            <input type="text" name="ciUsuario" value={formData.ciUsuario} onChange={handleChange} required placeholder="CI de quien registra" />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
