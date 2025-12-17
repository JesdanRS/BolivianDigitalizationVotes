-- Script para insertar usuarios de prueba en la base de datos
-- Ejecutar contra la base de datos usuarios_db

-- Insertar Jesus Imaña
INSERT INTO usuarios (nombre_completo, carnet, fecha_nacimiento, departamento, correo_electronico, correo_verificado, creado_en)
VALUES ('Jesus Imaña', '13120200', '2004-06-08', 'La Paz', 'imajesus08@gmail.com', false, NOW())
ON CONFLICT (carnet) DO UPDATE SET
    nombre_completo = EXCLUDED.nombre_completo,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento,
    correo_electronico = EXCLUDED.correo_electronico;

-- Insertar Daniel Imaña
INSERT INTO usuarios (nombre_completo, carnet, fecha_nacimiento, departamento, correo_electronico, correo_verificado, creado_en)
VALUES ('Daniel Imaña', '12130200', '2004-08-06', 'La Paz', 'jesus.imana@ucb.edu.bo', false, NOW())
ON CONFLICT (carnet) DO UPDATE SET
    nombre_completo = EXCLUDED.nombre_completo,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento,
    correo_electronico = EXCLUDED.correo_electronico;

-- Insertar Carlo Caba
INSERT INTO usuarios (nombre_completo, carnet, fecha_nacimiento, departamento, correo_electronico, correo_verificado, creado_en)
VALUES ('Carlo Caba', '13491987', '2004-02-04', 'La Paz', 'carlocaba2004@gmail.com', false, NOW())
ON CONFLICT (carnet) DO UPDATE SET
    nombre_completo = EXCLUDED.nombre_completo,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento,
    correo_electronico = EXCLUDED.correo_electronico;

-- Verificar inserción
SELECT id, nombre_completo, carnet, fecha_nacimiento, correo_electronico, correo_verificado
FROM usuarios
WHERE carnet IN ('13120200', '12130200');
