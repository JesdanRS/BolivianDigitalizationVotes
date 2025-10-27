# Dockerfile para candidatos-service

# =================================================================
# FASE 1: "EL TALLER DE CONSTRUCCIÓN" (Builder)
# =================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# =================================================================
# Paso 1: Construir la DEPENDENCIA (`dto-notificaciones`)
# =================================================================
COPY ./dto-notificaciones /app/dto-notificaciones
RUN cd /app/dto-notificaciones && mvn clean install -DskipTests

# =================================================================
# Paso 2: Construir el servicio principal (`candidatos`)
# =================================================================
COPY ./candidatos /app/candidatos
RUN cd /app/candidatos && mvn clean install -DskipTests

# =================================================================
# FASE 2: "EL VEHÍCULO DE PRODUCCIÓN" (Final Image)
# =================================================================
FROM openjdk:21-slim
WORKDIR /app

# Copiamos solo el JAR final desde el directorio target del módulo
COPY --from=build /app/candidatos/target/*.jar app.jar

# El comando que ejecutará el contenedor al arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]
