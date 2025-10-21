import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Candidatos from './pages/Candidatos'
import ConfirmarVoto from './pages/ConfirmarVoto'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/candidatos" replace />} />
      <Route path="/candidatos" element={<Candidatos />} />
      <Route path="/confirmar" element={<ConfirmarVoto />} />
    </Routes>
  )
}
