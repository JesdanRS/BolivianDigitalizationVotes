import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getCandidates, setSelectedCandidate, getVotedCandidate } from '../services/votacionService'
import '../App.css'

export default function Candidatos() {
  const navigate = useNavigate()
  const candidatos = getCandidates()
  const voted = getVotedCandidate()

  function handleVotar(candidato) {
    setSelectedCandidate(candidato)
    navigate('/confirmar')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="top-accent" />
      <header className="bdv-header">
        <div className="container">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center">✓</div>
            <span className="font-semibold">Elecciones Bolivia</span>
          </div>
          <nav className="bdv-nav">
            <button className="active">Candidatos</button>
            <button onClick={() => navigate('/confirmar')}>Mi Voto</button>
            <button>Resultados y Estadísticas</button>
            <button>Ayuda</button>
            <div style={{width:36,height:36,borderRadius:18,background:'#f0f0f0'}} />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Lista de Candidatos</h1>

        <div className="bg-white rounded-lg shadow p-4 divide-y">
          <div className="grid grid-cols-12 gap-4 py-3 font-semibold text-sm text-gray-500">
            <div className="col-span-2">FOTO</div>
            <div className="col-span-4">NOMBRE</div>
            <div className="col-span-4">PARTIDO</div>
            <div className="col-span-2 text-right">ACCIÓN</div>
          </div>

          {candidatos.map(c => (
            <div key={c.id} className="grid grid-cols-12 gap-4 items-center py-4">
              <div className="col-span-2">
                <img src={c.foto} alt={c.nombre} className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="col-span-4 text-gray-800 font-medium">{c.nombre}</div>
              <div className="col-span-4 text-gray-400">{c.partido}</div>
              <div className="col-span-2 text-right">
                <button
                  onClick={() => handleVotar(c)}
                  disabled={voted && voted.id === c.id}
                  className={`px-4 py-2 rounded-md text-white ${voted && voted.id === c.id ? 'bg-gray-400 cursor-default' : 'bg-red-600 hover:bg-red-700'}`}>
                  {voted && voted.id === c.id ? 'Votado' : 'Votar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-gray-400 py-8">© 2024 Elecciones Bolivia. Todos los derechos reservados.</footer>
    </div>
  )
}
