# Fase de construcción
FROM eclipse-temurin:21-jre-alpine AS builder
WORKDIR /extracted

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

RUN java -Djarmode=layertools -jar app.jar extract

# Fase final
FROM eclipse-temurin:21-jre-alpine
WORKDIR /application

# Instalar curl (para healthcheck opcional)
RUN apk add --no-cache curl

# Crear usuario seguro
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar capas extraídas
COPY --from=builder extracted/dependencies/ ./
COPY --from=builder extracted/spring-boot-loader/ ./
COPY --from=builder extracted/snapshot-dependencies/ ./
COPY --from=builder extracted/application/ ./

EXPOSE 8888

ENTRYPOINT ["java", "-cp","/application","org.springframework.boot.loader.launch.JarLauncher"]
