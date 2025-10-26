# Dockerfile para usuarios-service (Versión Final con Múltiples Dependencias)

# =================================================================
# FASE 1: "EL TALLER DE CONSTRUCCIÓN" (Builder)
# =================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# =================================================================
# Paso 1: Construir la PRIMERA dependencia (`dto-usuarios`)
# =================================================================
COPY ./dto-usuarios /app/dto-usuarios
RUN cd /app/dto-usuarios && mvn clean install -DskipTests

# =================================================================
# Paso 2: Construir la SEGUNDA dependencia (`dto-notificaciones`)
# =================================================================
COPY ./dto-notificaciones /app/dto-notificaciones
RUN cd /app/dto-notificaciones && mvn clean install -DskipTests

# =================================================================
# Paso 3: Construir el servicio principal (`usuarios-service`)
# Ahora Maven encontrará ambas dependencias en el repositorio .m2 del contenedor.
# =================================================================
COPY ./usuarios-service /app/usuarios-service
RUN cd /app/usuarios-service && mvn clean install -DskipTests

# =================================================================
# FASE 2: "EL VEHÍCULO DE PRODUCCIÓN" (Final Image)
# =================================================================
FROM openjdk:21-slim
WORKDIR /app

# Copiamos solo el JAR final que nos interesa desde la carpeta target del módulo correcto.
COPY --from=build /app/usuarios-service/target/*.jar app.jar

# El comando que ejecutará el contenedor al arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]