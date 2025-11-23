# ============================
# FASE 1: BUILDER
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# 1) Construimos primero el dto-usuarios (es dependencia)
COPY ./dto-usuarios /app/dto-usuarios
RUN cd /app/dto-usuarios && mvn clean install -DskipTests

# 2) Ahora construimos el microservicio de usuarios
COPY ./usuarios-service /app/usuarios-service
RUN cd /app/usuarios-service && mvn clean install -DskipTests

# ============================
# FASE 2: FINAL
# ============================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# (Opcional) Si luego quieres usar curl para healthchecks:
# RUN apk add --no-cache curl

# Copiamos solo el JAR final desde la fase build
COPY --from=build /app/usuarios-service/target/usuarios-service-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]