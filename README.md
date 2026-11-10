# Employee Management System

A small Java/Spring Boot employee CRUD application created for an enterprise DevOps learning project.

## Stack

- Java 17
- Spring Boot 3.4.5
- Gradle 8.12 (via Gradle Wrapper)
- MySQL 8.4
- Apache Tomcat 10.1
- Docker
- Jenkins

## Features

- Create, list, retrieve, update and delete employees
- Input validation and duplicate-email checking
- Health endpoint at `/actuator/health`
- Static browser UI served by the application

## Prerequisites

- JDK 17
- Docker Desktop
- Git
- Internet access for Gradle dependency downloads

## 1. Generate the Gradle Wrapper (first time)

If Gradle is installed locally, run from the project root:

```powershell
gradle wrapper --gradle-version 8.12
```

Commit the generated `gradlew`, `gradlew.bat`, and `gradle/wrapper/` files to Git.

## 2. Start MySQL

```powershell
docker compose up -d mysql
docker compose ps
docker compose logs -f mysql
```

Wait until MySQL is healthy. The local-only credentials are defined in `docker-compose.yml`.
Do not reuse them outside this disposable learning environment.

## 3. Build and test

Windows PowerShell:

```powershell
.\gradlew.bat clean test bootWar
```

Linux:

```bash
./gradlew clean test bootWar
```

The WAR is created at `build/libs/employee-management-system.war`.

## 4. Run locally

```powershell
.\gradlew.bat bootRun
```

Open `http://localhost:8080`.

Health check: `http://localhost:8080/actuator/health`.

## 5. API examples

List employees:

```bash
curl http://localhost:8080/api/employees
```

Create an employee:

```bash
curl -X POST http://localhost:8080/api/employees   -H "Content-Type: application/json"   -d '{"name":"Arnold","department":"DevOps","email":"arnold@example.com"}'
```

Update an employee:

```bash
curl -X PUT http://localhost:8080/api/employees/1   -H "Content-Type: application/json"   -d '{"name":"Arnold Bernard","department":"Platform Engineering","email":"arnold@example.com"}'
```

Delete an employee:

```bash
curl -X DELETE http://localhost:8080/api/employees/1
```

## 6. Deploy the WAR to standalone Tomcat

Use Java 17 and Tomcat 10.1. Configure `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`
in the Tomcat service environment. Copy the generated WAR to Tomcat's `webapps/`
directory as `ROOT.war` to serve the application at `/`.

For example, on a Linux host:

```bash
cp build/libs/employee-management-system.war "$CATALINA_HOME/webapps/ROOT.war"
```

Tomcat must be configured with the same database connectivity and credentials.

## 7. Build the container image

Build the WAR first, then:

```bash
docker build -t employee-management-system:1.0.0 .
```

The Dockerfile uses Tomcat 10.1 with Java 17 and copies the WAR as `ROOT.war`.

For container-to-container database access, configure `DB_URL` to use the MySQL
service DNS name (for example, `jdbc:mysql://mysql:3306/employee_db?...`) on a
shared Docker network. Do not use `localhost` from inside the application container
to reach a separate MySQL container.

## CI/CD roadmap

1. GitHub source control
2. Jenkins CI: build, test, archive WAR
3. Security checks: Gitleaks, SonarQube and Trivy
4. Nexus artifact publishing
5. Docker image build and ACR push
6. AKS deployment
7. GitOps repository and Argo CD reconciliation
8. Monitoring, TLS and secrets management

## Security and production notes

- The credentials in the local Compose file are for a disposable local lab only.
- Never commit real passwords, tokens, certificates or private keys.
- Replace Hibernate `ddl-auto=update` with controlled migrations (Flyway/Liquibase)
  for a production-oriented implementation.
- Add authentication/authorization before exposing employee data beyond the local lab.
- Restrict Jenkins and application access with network controls.
