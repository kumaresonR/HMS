# Hospital Management System (HMS)

A comprehensive, scalable, and modern Hospital Management System built using a **Microservices Architecture**. This project consists of multiple decoupled services designed to handle all aspects of hospital administration, patient care, and clinical operations efficiently.

## 🏗️ System Architecture

This application leverages a distributed architecture using **Spring Cloud** components suited for enterprise-grade applications. It separates concerns into individual microservices that interact via a centralized API Gateway and dynamic service discovery.

- **Frontend:** TypeScript / Node.js (located in `hms-master/`)
- **Backend:** Java Spring Boot Microservices
- **API Gateway:** Routes all incoming UI requests securely to the appropriate microservices (`hms-apigateway-services`).
- **Service Registry:** Provides dynamic service discovery and load balancing (`hms-discovery-service`).

## 🏥 Core Modules & Microservices

The repository is modularized into the following domain-specific services:

### 1. Patient & Clinical Services
- **`patient-management-services`**: Core demographics, patient records, and history.
- **`opd-management-services`**: Out-Patient Department management (consultations, prescriptions).
- **`ipd-management-services`**: In-Patient Department management (admissions, wards, bed tracking).
- **`hms-OT-management-services`**: Operation Theater scheduling and tracking.
- **`laborotary-management-services`**: Diagnostic test requests and lab result reporting.
- **`bloodbank-management-services`**: Blood inventory, donations, and transfusions.

### 2. Administrative & Operations Services
- **`frontoffice-management-services`**: Reception, appointments, and visitor logs.
- **`admin-management-services`**: System administration, user roles, and access control.
- **`inventory-management-services`**: Pharmacy, medical equipment, and non-clinical supplies.
- **`birth-death-management-services`**: Tracking of birth and mortality records.
- **`ambulance-management-services`**: Ambulance fleet tracking, dispatching, and logs.

### 3. Financial Services
- **`finance-management-services`**: General ledger, income, and expenses tracking.
- **`billling-management-services`**: Patient invoicing, payment collections, and receipts.
- **`tpa-management-services`**: Third-Party Administrator/Insurance claims management.

### 4. Utility & Infrastructure Services
- **`login-management-services`**: Authentication and Authorization (likely JWT/OAuth2).
- **`notification-management-services`**: SMS, Email, and in-app alerts for doctors and patients.
- **`dashboard-management-services`**: Aggregation service for analytics and statistical widgets.
- **`hms-apigateway-services`**: The single entry point for all frontend client invocations.
- **`hms-discovery-service`**: Eureka naming server for seamless microservice registration.

## 🛠️ Technology Stack

| Component         | Technology |
|-------------------|------------|
| **Backend**       | Java, Spring Boot, Spring Cloud (Gateway, Eureka) |
| **Frontend**      | React/Node.js, TypeScript |
| **Build Tool**    | Maven (`.pom`), npm |

## 🚀 Getting Started

### Prerequisites
- **JDK 17+** (or whichever version is defined in your `pom.xml`)
- **Maven** (or use the provided `./mvnw` wrappers inside each service)
- **Node.js** (for running the frontend app in `hms-master`)

### Running the Project Locally

Because this is a microservices ecosystem, services should be brought up in a specific order:

1. **Discovery Service**
   Navigate to `hms-discovery-service` and run it first so other services can register:
   ```bash
   cd hms-discovery-service
   ./mvnw spring-boot:run
   ```
2. **API Gateway**
   Run the gateway to handle routing (`hms-apigateway-services`).
3. **Core Services**
   Start required independent services like Login, Patient, Admin, etc., as needed using the same Maven wrapper command.
4. **Frontend Dashboard**
   Navigate into `hms-master` to fire up the UI:
   ```bash
   cd hms-master
   npm install
   npm start
   ```

## 🤝 Contributing
For feature enhancements, please create a new branch, ensure the code builds successfully using Maven/npm, and submit a Pull Request.

---
*Created for efficient operations handling in the modern healthcare ecosystem.*
