// utils/csvToUsuariosPadron.js
export const csvToUsuariosPadron = (csvText) => {
  const lineas = csvText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lineas.length === 0) return [];

  // Detectar posible encabezado
  const tieneHeader = lineas[0].toLowerCase().includes('carnet');
  const datos = tieneHeader ? lineas.slice(1) : lineas;

  const usuarios = datos.map((linea, idx) => {
    const [carnet, nombreCompleto, fechaNacimiento, departamento, correoElectronico] =
      linea.split(',').map(v => v.trim());

    // Aquí podrías validar y lanzar error si falta algo
    if (!carnet || !nombreCompleto || !fechaNacimiento || !departamento || !correoElectronico) {
      throw new Error(`Fila ${idx + 1}: datos incompletos`);
    }

    return {
      carnet,
      nombreCompleto,
      fechaNacimiento,
      departamento,
      correoElectronico
    };
  });

  return usuarios;
};