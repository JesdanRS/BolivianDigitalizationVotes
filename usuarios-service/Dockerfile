# ============================
# FASE 1: BUILDER
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# 1) Construimos primero dto-usuarios (dependencia)
COPY ./dto-usuarios /app/dto-usuarios
RUN cd /app/dto-usuarios && mvn clean install -DskipTests

# 2) Construimos dto-notificaciones (si otros servicios lo usan como dependencia)
COPY ./dto-notificaciones /app/dto-notificaciones
RUN cd /app/dto-notificaciones && mvn clean install -DskipTests

# 3) dto-auditoria_registros  <-- NUEVO
COPY ./dto-auditoria_registros /app/dto-auditoria_registros
RUN cd /app/dto-auditoria_registros && mvn clean install -DskipTests

# 3) Construimos el microservicio de usuarios
COPY ./usuarios-service /app/usuarios-service
RUN cd /app/usuarios-service && mvn clean install -DskipTests

# ============================
# FASE 2: FINAL
# ============================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiamos solo el JAR final del servicio de usuarios
COPY --from=build /app/usuarios-service/target/usuarios-service-0.0.1-SNAPSHOT.jar app.jar

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]