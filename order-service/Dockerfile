# Build
FROM maven:3-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# Run
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8082

CMD [ "java", "-jar", "app.jar" ] 