# Dockerfile para resultados_estadisticas (Versión Final con Múltiples Dependencias)

# =================================================================
# FASE 1: "EL TALLER DE CONSTRUCCIÓN" (Builder)
# =================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# =================================================================
# Paso 1: Construir la PRIMERA dependencia (`dto-resultados_estadisticas`)
# =================================================================
COPY ./dto-resultados_estadisticas /app/dto-resultados_estadisticas
RUN cd /app/dto-resultados_estadisticas && mvn clean install -DskipTests

# =================================================================
# Paso 2: Construir la SEGUNDA dependencia (`dto-votaciones`)
# =================================================================
COPY ./dto-votaciones /app/dto-votaciones
RUN cd /app/dto-votaciones && mvn clean install -DskipTests

# =================================================================
# Paso 3: Construir el servicio principal (`resultados_estadisticas`)
# Ahora Maven encontrará ambas dependencias en el repositorio .m2 del contenedor.
# =================================================================
COPY ./resultados_estadisticas /app/resultados_estadisticas
RUN cd /app/resultados_estadisticas && mvn clean install -DskipTests

# =================================================================
# FASE 2: "EL VEHÍCULO DE PRODUCCIÓN" (Final Image)
# =================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiamos solo el JAR final que nos interesa desde la carpeta target del módulo correcto.
COPY --from=build /app/resultados_estadisticas/target/*.jar app.jar

# El comando que ejecutará el contenedor al arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]

