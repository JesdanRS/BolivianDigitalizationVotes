# FASE 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copiamos el módulo y construimos (saltando tests)
COPY ./resultados_estadisticas /app/resultados_estadisticas
RUN cd /app/resultados_estadisticas && mvn clean package -DskipTests -Dmaven.test.skip=true

# FASE 2: Runtime
FROM openjdk:21-slim
WORKDIR /app
COPY --from=build /app/resultados_estadisticas/target/resultados_estadisticas-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","app.jar"]

