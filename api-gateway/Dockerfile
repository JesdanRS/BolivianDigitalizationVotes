# Dockerfile para api-gateway

# FASE 1: Builder
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean install -DskipTests

EXPOSE 8080

# FASE 2: Final
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Instalar curl para healthchecks
RUN apk add --no-cache curl

COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]