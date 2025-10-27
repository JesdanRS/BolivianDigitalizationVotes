# ============================
# FASE 1: BUILDER
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiamos y construimos primero el DTO, ya que es dependencia
COPY ./dto-auditoria_registros /app/dto-auditoria_registros
RUN cd /app/dto-auditoria_registros && mvn clean install -DskipTests

# Ahora copiamos y construimos el servicio de auditoría
COPY ./auditoria_registros-services /app/auditoria_registros-services
RUN cd /app/auditoria_registros-services && mvn clean package -DskipTests

# ============================
# FASE 2: FINAL
# ============================
FROM openjdk:21-slim
WORKDIR /app

# Copiamos solo el JAR compilado desde la fase anterior
COPY --from=build /app/auditoria_registros-services/target/auditoria_registros-services-0.0.1-SNAPSHOT.jar app.jar

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
