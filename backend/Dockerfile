# Multi-stage build for Java 21 Spring Boot application
# Stage 1: Build with Maven
FROM eclipse-temurin:21-jdk-jammy AS builder

# Set working directory
WORKDIR /build

# Copy Maven wrapper files
COPY mvnw mvnw.cmd pom.xml ./

# Copy Maven wrapper directory
COPY .mvn .mvn

# Copy source code
COPY src src

# Build the application using Maven wrapper
RUN chmod +x ./mvnw && \
    ./mvnw clean package -DskipTests

# Stage 2: Runtime with minimal JRE image
FROM eclipse-temurin:21-jre-jammy

# Create non-root user for security
RUN useradd -m -u 1000 appuser

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /build/target/*.jar application.jar

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port (adjust if your app runs on a different port)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set environment variables for production
ENV JAVA_TOOL_OPTIONS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=25.0"

# Run the application
ENTRYPOINT ["java", "-jar", "application.jar"]
