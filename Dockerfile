# Stage 1: Build the Maven application using JDK 17 (Temurin)
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

# Copy the source code and configuration pom
COPY pom.xml .
COPY src ./src

# Compile and package the executable jar without running local tests
RUN mvn clean package -DskipTests

# Stage 2: Use the official lightweight Eclipse Temurin JDK 17 Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 for the Spring Boot application
EXPOSE 8080

# Run the jar file on container startup
ENTRYPOINT ["java", "-jar", "app.jar"]