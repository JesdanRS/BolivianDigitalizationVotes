# Dockerfile para candidatos-service (Versión Final con Múltiples Dependencias)

# =================================================================
# FASE 1: "EL TALLER DE CONSTRUCCIÓN" (Builder)
# =================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# =================================================================
# Paso 1: Construir la dependencia (`dto-notificaciones`)
# =================================================================
COPY ./dto-notificaciones /app/dto-notificaciones
RUN cd /app/dto-notificaciones && mvn clean install -DskipTests

# =================================================================
# Paso 2: Construir la dependencia (`dto-candidatos`)
# =================================================================
COPY ./dto-candidatos /app/dto-candidatos
RUN cd /app/dto-candidatos && mvn clean install -DskipTests

# 3) dto-auditoria_registros  <-- NUEVO
COPY ./dto-auditoria_registros /app/dto-auditoria_registros
RUN cd /app/dto-auditoria_registros && mvn clean install -DskipTests

# =================================================================
# Paso 3: Construir el servicio principal (`candidatos`)
# Ahora Maven encontrará las dependencias en el repositorio .m2 del contenedor.
# =================================================================
COPY ./candidatos /app/candidatos
RUN cd /app/candidatos && mvn clean install -DskipTests

# =================================================================
# FASE 2: "EL VEHÍCULO DE PRODUCCIÓN" (Final Image)
# =================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiamos solo el JAR final que nos interesa desde la carpeta target del módulo correcto.
COPY --from=build /app/candidatos/target/*.jar app.jar

# Usar el perfil Docker
ENV SPRING_PROFILES_ACTIVE=docker

# El comando que ejecutará el contenedor al arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]