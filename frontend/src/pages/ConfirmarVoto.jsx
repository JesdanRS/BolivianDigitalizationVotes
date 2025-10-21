import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSelectedCandidate, confirmVote } from '../services/votacionService'
import '../App.css'

export default function ConfirmarVoto() {
  const navigate = useNavigate()
  const [candidato, setCandidato] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const sel = getSelectedCandidate()
    if (!sel) {
      navigate('/candidatos', { replace: true })
      return
    }
    setCandidato(sel)
  }, [navigate])

  function handleCancelar() {
    navigate('/candidatos')
  }

  function handleConfirmar() {
    const voted = confirmVote()
    if (voted) {
      setConfirmed(true)
      setTimeout(() => {
        navigate('/candidatos')
      }, 800)
    }
  }

  if (!candidato) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="top-accent" />
      <header className="bdv-header">
        <div className="container">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center">✓</div>
            <span className="font-semibold">Elecciones Bolivia</span>
          </div>
          <nav className="bdv-nav">
            <button onClick={() => navigate('/candidatos')}>Candidatos</button>
            <button className="active">Mi Voto</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full flex items-start justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">¿Estás seguro de tu voto?</h2>
          <p className="text-sm text-red-400 mb-8">Por favor, revisa tu selección antes de confirmar. Una vez confirmado, no podrás cambiar tu voto.</p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex items-center gap-6">
            <img src={candidato.foto} alt={candidato.nombre} className="w-28 h-28 rounded-md object-cover" />
            <div className="text-left">
              <div className="text-xl font-semibold text-gray-800">{candidato.nombre}</div>
              <div className="text-sm text-red-400">{candidato.partido}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={handleCancelar} className="px-6 py-3 text-gray-700">Cancelar</button>
            <button
              onClick={handleConfirmar}
              disabled={confirmed}
              className={`px-6 py-3 rounded-md text-white ${confirmed ? 'bg-green-500' : 'bg-red-600 hover:bg-red-700'}`}>
              {confirmed ? 'Voto Confirmado' : 'Confirmar Voto'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
