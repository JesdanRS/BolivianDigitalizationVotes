# ============================
# FASE 1: BUILDER
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Construimos primero el DTO (dependencia)
COPY ./dto-auditoria_registros /app/dto-auditoria_registros
RUN cd /app/dto-auditoria_registros && mvn clean install -DskipTests

# Construimos el servicio de auditoría
COPY ./auditoria_registros-services /app/auditoria_registros-services
RUN cd /app/auditoria_registros-services && mvn clean package -DskipTests

# ============================
# FASE 2: FINAL
# ============================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# (Opcional) curl si lo necesitas para healthchecks, etc.
RUN apk add --no-cache curl

COPY --from=build /app/auditoria_registros-services/target/auditoria_registros-services-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]