# Dockerfile para candidatos-service - Optimizado

# =================================================================
# FASE ÚNICA: Usar JAR pre-compilado
# =================================================================
FROM openjdk:21-slim

WORKDIR /app

# Copiar el JAR compilado directamente
COPY ./candidatos/target/candidatos-0.0.1-SNAPSHOT.jar app.jar

# Usar el perfil Docker
ENV SPRING_PROFILES_ACTIVE=docker

# El comando que ejecutará el contenedor al arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]