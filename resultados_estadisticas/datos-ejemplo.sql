-- ============================================
-- DATOS DE EJEMPLO ADICIONALES PARA RESULTADOS_MESA
-- ============================================

-- Insertar más resultados para tener datos variados
INSERT INTO resultados_mesa (
    departamento, municipio, recinto, mesa, inscritos,
    votos_validos_presencial, votos_nulos_presencial, votos_blancos_presencial,
    votos_validos_web, votos_nulos_web, votos_blancos_web,
    registrado_en, actualizado_en
) VALUES 
-- Beni
('Beni', 'Trinidad', 'Unidad Educativa Mariscal Sucre', 'Mesa 1', 280, 
 160, 12, 8, 70, 5, 3, NOW(), NOW()),

('Beni', 'Riberalta', 'Colegio Nacional', 'Mesa 2', 220,
 130, 10, 5, 55, 4, 2, NOW(), NOW()),

-- Pando
('Pando', 'Cobija', 'Escuela Central', 'Mesa 1', 180,
 100, 8, 4, 50, 3, 2, NOW(), NOW()),

-- Oruro
('Oruro', 'Oruro', 'Instituto Técnico', 'Mesa 3', 320,
 190, 15, 7, 80, 6, 4, NOW(), NOW()),

('Oruro', 'Huanuni', 'Escuela Municipal', 'Mesa 4', 260,
 150, 12, 6, 70, 5, 3, NOW(), NOW()),

-- Potosí
('Potosí', 'Potosí', 'Universidad Autónoma', 'Mesa 5', 310,
 180, 14, 8, 85, 6, 4, NOW(), NOW()),

('Potosí', 'Uyuni', 'Colegio Fiscal', 'Mesa 6', 240,
 140, 11, 6, 65, 5, 3, NOW(), NOW()),

-- Tarija
('Tarija', 'Tarija', 'Unidad Educativa San Luis', 'Mesa 7', 340,
 200, 16, 9, 90, 7, 5, NOW(), NOW()),

('Tarija', 'Yacuiba', 'Escuela Frontera', 'Mesa 8', 290,
 170, 13, 7, 75, 6, 4, NOW(), NOW()),

-- Chuquisaca
('Chuquisaca', 'Sucre', 'Universidad Mayor de San Francisco Xavier', 'Mesa 9', 360,
 220, 17, 10, 95, 8, 5, NOW(), NOW()),

('Chuquisaca', 'Monteagudo', 'Colegio Nacional Monteagudo', 'Mesa 10', 270,
 160, 12, 7, 70, 5, 3, NOW(), NOW());

-- ============================================
-- CONSULTAS ÚTILES PARA VERIFICAR LOS DATOS
-- ============================================

-- Ver todos los resultados
-- SELECT * FROM resultados_mesa ORDER BY id;

-- Contar resultados por departamento
-- SELECT departamento, COUNT(*) as total_mesas 
-- FROM resultados_mesa 
-- GROUP BY departamento 
-- ORDER BY total_mesas DESC;

-- Calcular total de inscritos por departamento
-- SELECT departamento, SUM(inscritos) as total_inscritos 
-- FROM resultados_mesa 
-- GROUP BY departamento 
-- ORDER BY total_inscritos DESC;

-- Ver mesas con más de 300 inscritos
-- SELECT departamento, municipio, mesa, inscritos 
-- FROM resultados_mesa 
-- WHERE inscritos >= 300 
-- ORDER BY inscritos DESC;

-- Calcular participación total (presencial + web)
-- SELECT 
--     departamento,
--     SUM(inscritos) as total_inscritos,
--     SUM(votos_validos_presencial + votos_validos_web + 
--         votos_nulos_presencial + votos_nulos_web + 
--         votos_blancos_presencial + votos_blancos_web) as total_votos,
--     ROUND(
--         (SUM(votos_validos_presencial + votos_validos_web + 
--              votos_nulos_presencial + votos_nulos_web + 
--              votos_blancos_presencial + votos_blancos_web)::numeric / 
--          SUM(inscritos)::numeric) * 100, 2
--     ) as participacion_porcentaje
-- FROM resultados_mesa 
-- GROUP BY departamento 
-- ORDER BY participacion_porcentaje DESC;
