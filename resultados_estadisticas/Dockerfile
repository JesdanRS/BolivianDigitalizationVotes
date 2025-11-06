# ============================
# FASE 1: BUILDER
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiamos el proyecto completo
COPY . /app

# Construimos el proyecto
RUN mvn clean package -DskipTests

# ============================
# FASE 2: FINAL
# ============================
FROM openjdk:21-slim
WORKDIR /app

# Copiamos solo el JAR compilado desde la fase anterior
COPY --from=build /app/target/resultados_estadisticas-0.0.1-SNAPSHOT.jar app.jar

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
