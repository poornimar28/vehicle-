# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend
FROM eclipse-temurin:21-jdk-jammy AS backend-build
WORKDIR /app/backend
COPY backend/mvnw backend/pom.xml ./
COPY backend/.mvn .mvn
COPY backend/src src

# Copy frontend build into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist/ src/main/resources/static/

RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Stage 3: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
