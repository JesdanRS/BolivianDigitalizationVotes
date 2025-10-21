// Servicio frontend simple: lista mock y gestión de selección/voto con localStorage
const STORAGE_SELECTED = 'bdv_selected_candidate';
const STORAGE_VOTED = 'bdv_voted_candidate';

const _mockCandidates = [
  { id: 1, nombre: 'Ricardo Mendoza', partido: 'Partido de la Esperanza', foto: '/src/assets/images/example.png' },
  { id: 2, nombre: 'Sofia Rodriguez', partido: 'Movimiento por el Cambio', foto: '/src/assets/images/example.png' },
  { id: 3, nombre: 'Carlos Vargas', partido: 'Frente Unido', foto: '/src/assets/images/example.png' },
  { id: 4, nombre: 'Isabel Flores', partido: 'Alianza Progresista', foto: '/src/assets/images/example.png' },
  { id: 5, nombre: 'Jorge Morales', partido: 'Convergencia Nacional', foto: '/src/assets/images/example.png' }
];

export function getCandidates() {
  return _mockCandidates;
}

export function setSelectedCandidate(candidate) {
  if (!candidate) {
    localStorage.removeItem(STORAGE_SELECTED);
    return;
  }
  localStorage.setItem(STORAGE_SELECTED, JSON.stringify(candidate));
}

export function getSelectedCandidate() {
  const raw = localStorage.getItem(STORAGE_SELECTED);
  return raw ? JSON.parse(raw) : null;
}

export function confirmVote() {
  const selected = getSelectedCandidate();
  if (!selected) return null;
  localStorage.setItem(STORAGE_VOTED, JSON.stringify(selected));
  localStorage.removeItem(STORAGE_SELECTED);
  return selected;
}

export function getVotedCandidate() {
  const raw = localStorage.getItem(STORAGE_VOTED);
  return raw ? JSON.parse(raw) : null;
}
