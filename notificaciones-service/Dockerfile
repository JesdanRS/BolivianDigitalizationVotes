# Dockerfile para notificaciones-service

# =================================================================
# FASE 1: "EL TALLER DE CONSTRUCCIÓN" (Builder)
# =================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Primero copiamos y construimos el dto-notificaciones, ya que es una dependencia
COPY ./dto-notificaciones /app/dto-notificaciones
RUN cd /app/dto-notificaciones && mvn clean install -DskipTests

# Ahora copiamos y construimos el servicio de notificaciones
COPY ./notificaciones-service /app/notificaciones-service
RUN cd /app/notificaciones-service && mvn clean install -DskipTests

# =================================================================
# FASE 2: "EL VEHÍCULO DE PRODUCCIÓN" (Final Image)
# =================================================================
FROM openjdk:21-slim
WORKDIR /app

# Copiamos solo el JAR final que se generó en la fase de construcción.
# ¡OJO! El nombre del JAR debe coincidir con el que genera Maven.
COPY --from=build /app/notificaciones-service/target/*.jar app.jar

# El comando que ejecutará el contenedor al arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]