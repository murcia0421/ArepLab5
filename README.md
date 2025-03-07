# Taller5_AREP: Taller de trabajo individual en patrones arquitecturales


This project is a Spring Boot application that manages properties (address, price, size, description)
using a MySQL database. The application exposes a REST API to perform CRUD (Create, Read, Update, Delete) operations on properties.

---

## Getting Started

### Prerequisites

Before you begin, ensure that you have the following installed:

- **Java JDK 17** (or higher)  
  Download it from [Oracle](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or use OpenJDK.
- **Apache Maven**  
  Download it from [Maven Official](https://maven.apache.org/download.cgi) and follow the installation instructions.
- **Git** (optional, for cloning the repository)
- **Docker** (for containerization and deployment)
- **AWS CLI** (for AWS CodeBuild and deployment)

### Installation

1. **Clone the repository:**

   ```bash
   https://github.com/murcia0421/ArepLab5.git
2. **Navigate to the project directory:**
   
  ```bash
  cd ArepLab5
  ```

3. Compile and package the project with Maven:
   
  ```bash
  mvn clean package
  ```
4. Run the server:

  ```bash
  mvn spring-boot:run
  ```

5. Check the console for messages such as:

  ```bash
  Server running on port 8080...
   ```

## Technologies Used

- Java 17
- Apache Maven
- JUnit 5 (for unit testing)
- Reflections (for automatic classpath scanning)

## architecture

The project follows a microservices-based architecture and is designed to be deployed on AWS EC2 using Docker.
The structure and main components are described below:

![image](https://github.com/user-attachments/assets/0c8e76a6-e9c3-4f57-87df-7afb2a6f50e6)

# Components of the Architecture

## 1. EC2: Spring Boot (Backend App)

### PropertyController
- It is the REST handler that handles HTTP (GET, POST, PUT, DELETE) requests.
- Exposes API endpoints to manage properties.

### PropertyService
- It contains the business logic for managing properties (create, read, update, delete).
- Communicates with the repository to access the database.

### PropertyRepository
- It is the data access layer that interacts with the MySQL database.
- Uses Spring Data JPA to perform CRUD operations.

### Property.java
- It is the JPA entity that represents a property in the database.
- Defines the structure of the property table (id, address, price, size, description).

### AccessingDataJpaApplication
- It is the main class that starts the Spring Boot application.
- Configures the application context and loads the necessary dependencies.

## 2. EC2: MySQL (Database)

### MySQL Server
- It hosts the `property_management` database, where properties are stored.
- The database communicates with the Spring Boot application via port `3306`.

### Table `property`
- It is the table in the database that stores the data for the properties.
- The columns in the table are: `id`, `address`, `price`, `size`, `description`.

## 3. Architecture Flow

### Client (Frontend or Postman)
- Makes HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) to the Spring Boot server (EC2 1).

### Spring Boot Server (EC2 1)
- The `PropertyController` receives the requests and delegates them to the `PropertyService`.
- The `PropertyService` uses the `PropertyRepository` to interact with the database.
- The `PropertyRepository` executes queries against the MySQL database (EC2 2) using the `Property.java` entity.

### MySQL Database (EC2 2)
- Stores property data in the `property` table.
- Responds to queries from the Spring Boot server.

### Answer
- The Spring Boot server returns an HTTP (`JSON`) response to the client with the requested data.

## Deployment

![image](https://github.com/user-attachments/assets/37ed5778-b949-4e39-95ba-dc55c354dfac)


https://github.com/user-attachments/assets/b54b8836-76d6-4464-a960-c2e6f5374f67


## Author

- Juan Daniel Murcia
- GitHub: murcia0421
