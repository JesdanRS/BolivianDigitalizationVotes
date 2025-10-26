# FASE 1: Builder
# Usamos una imagen con Maven y Java
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Primero copiamos y construimos el dto-votaciones ya que es una dependencia
COPY ./dto-votaciones /app/dto-votaciones
RUN cd /app/dto-votaciones && mvn clean install -DskipTests

# Ahora copiamos y construimos el servicio de votaciones
COPY ./votaciones-service /app/votaciones-service
RUN cd /app/votaciones-service && mvn clean install -DskipTests

# FASE 2: Final
FROM openjdk:21-slim
WORKDIR /app

# Copiamos solo el JAR final que se generó en la fase de construcción
COPY --from=build /app/votaciones-service/target/votaciones-service-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
