@echo off
echo ========================================
echo LIMPIANDO ARCHIVOS INNECESARIOS
echo ========================================
echo.

cd ..

echo Eliminando archivos de Keycloak de la raiz...
if exist "EJEMPLOS_POSTMAN.md" del "EJEMPLOS_POSTMAN.md"
if exist "FAQ_KEYCLOAK.md" del "FAQ_KEYCLOAK.md"
if exist "FLUJO_KEYCLOAK_VISUAL.md" del "FLUJO_KEYCLOAK_VISUAL.md"
if exist "GUIA_KEYCLOAK_POSTMAN.md" del "GUIA_KEYCLOAK_POSTMAN.md"
if exist "PASOS_RAPIDOS_KEYCLOAK.md" del "PASOS_RAPIDOS_KEYCLOAK.md"
if exist "README_KEYCLOAK.md" del "README_KEYCLOAK.md"
if exist "verificar_keycloak.sh" del "verificar_keycloak.sh"
if exist "Keycloak_Resultados.postman_collection.json" del "Keycloak_Resultados.postman_collection.json"

echo.
echo Eliminando archivos antiguos de resultados_estadisticas...
cd resultados_estadisticas

if exist "COMANDOS-PRUEBA-DOCKER.md" del "COMANDOS-PRUEBA-DOCKER.md"
if exist "COMANDOS-PRUEBA-EUREKA.md" del "COMANDOS-PRUEBA-EUREKA.md"
if exist "COMANDOS-PRUEBA-GATEWAY.md" del "COMANDOS-PRUEBA-GATEWAY.md"
if exist "COMANDOS-PRUEBA.md" del "COMANDOS-PRUEBA.md"
if exist "CRITERIO-1-PERSISTENCIA.md" del "CRITERIO-1-PERSISTENCIA.md"
if exist "CRITERIO-2-EUREKA.md" del "CRITERIO-2-EUREKA.md"
if exist "CRITERIO-3-GATEWAY.md" del "CRITERIO-3-GATEWAY.md"
if exist "CRITERIO-4-DOCKER.md" del "CRITERIO-4-DOCKER.md"
if exist "CRITERIO-5-KEYCLOAK.md" del "CRITERIO-5-KEYCLOAK.md"
if exist "DOCKER-COMPLETADO.md" del "DOCKER-COMPLETADO.md"
if exist "EUREKA-COMPLETADO.md" del "EUREKA-COMPLETADO.md"
if exist "GATEWAY-COMPLETADO.md" del "GATEWAY-COMPLETADO.md"
if exist "HELP.md" del "HELP.md"
if exist "INDICE-DOCUMENTACION.md" del "INDICE-DOCUMENTACION.md"
if exist "LISTO-PARA-DEMO.md" del "LISTO-PARA-DEMO.md"
if exist "README.md" del "README.md"
if exist "RESUMEN-4-CRITERIOS.md" del "RESUMEN-4-CRITERIOS.md"
if exist "RESUMEN-FINAL-COMPLETO.md" del "RESUMEN-FINAL-COMPLETO.md"
if exist "RESUMEN-IMPLEMENTACION.md" del "RESUMEN-IMPLEMENTACION.md"
if exist "TODO-COMPLETADO.md" del "TODO-COMPLETADO.md"
if exist "DEMO-RAPIDA.txt" del "DEMO-RAPIDA.txt"
if exist "INICIO-RAPIDO.txt" del "INICIO-RAPIDO.txt"

echo.
echo ========================================
echo LIMPIEZA COMPLETADA
echo ========================================
echo.
echo Archivos restantes en resultados_estadisticas:
echo   - GUIA_EVALUACION_COMPLETA.md (UNICA GUIA)
echo   - Keycloak_Resultados.postman_collection.json
echo   - LIMPIAR_ARCHIVOS.bat (este script)
echo.
echo Puedes eliminar este script despues de ejecutarlo.
echo.
pause
