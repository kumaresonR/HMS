# Hospital Management System (HMS)

A comprehensive microservices-based Hospital Management System built with Spring Boot and React.

## 🏥 Overview

The HMS (Hospital Management System) is a full-stack healthcare management solution designed for hospitals and clinics. It provides comprehensive modules for managing patients, appointments, billing, inventory, and all aspects of hospital operations.

## 🏗️ Architecture

This is a **microservices architecture** with the following components:

- **20+ Microservices** (Spring Boot 3.3.3, Java 17)
- **Eureka Discovery Service** - Service registry and discovery
- **API Gateway** (Spring Cloud Gateway) - Single entry point for all services
- **PostgreSQL Database** - Shared database with schema-per-service pattern
- **Redis Cache** - Caching and session management
- **React Frontend** - Modern TypeScript-based user interface

## 📁 Project Structure

```
HMS/
├── hms-discovery-service/          # Eureka service registry
├── hms-apigateway-services/        # API Gateway
├── admin-management-services/      # Admin operations
├── patient-management-services/    # Patient management
├── opd-management-services/        # Outpatient department
├── ipd-management-services/        # Inpatient department
├── billling-management-services/   # Billing and payments
├── login-management-services/      # Authentication & authorization
├── ambulance-management-services/   # Ambulance services
├── bloodbank-management-services/   # Blood bank management
├── laborotary-management-services/  # Laboratory services
├── inventory-management-services/   # Inventory management
├── finance-management-services/     # Financial management
├── frontoffice-management-services/ # Front office operations
├── hms-OT-management-services/      # Operation theater
├── tpa-management-services/         # Third-party administrator
├── notification-management-services/ # Notifications
├── dashboard-management-services/    # Analytics & dashboards
├── birth-death-management-services/ # Birth & death records
├── HMS Front End/                   # React frontend application
├── docker-compose.yml               # Docker setup for PostgreSQL & Redis
├── database-setup.sql               # Database initialization script
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- **Java 17** (JDK 17)
- **Maven 3.6+**
- **PostgreSQL 12+**
- **Redis 6+**
- **Node.js 16+** and **npm**

### Option 1: Using Docker (Recommended)

```bash
# 1. Start PostgreSQL and Redis
docker-compose up -d

# 2. Setup database
# Windows:
database-setup.bat
# Linux/Mac:
./database-setup.sh

# 3. Start Eureka Discovery Service
cd hms-discovery-service/hms-discovery-service
mvn spring-boot:run

# 4. Start API Gateway (in new terminal)
cd hms-apigateway-services
mvn spring-boot:run

# 5. Start microservices (in separate terminals)
cd login-management-services/login-management-services
mvn spring-boot:run
# Repeat for other services...

# 6. Start Frontend
cd "HMS Front End/hms-master"
npm install
npm start
```

### Option 2: Manual Setup

See detailed instructions in the setup documentation.

## 📚 Documentation

- **[Local Setup Guide](LOCAL_SETUP_GUIDE.md)** - Complete local development setup instructions
- **[Docker Setup Guide](DOCKER_SETUP.md)** - Docker-based setup instructions
- **[Quick Start Guide](QUICK_START.md)** - Quick reference for getting started
- **[Server Cost Analysis](SERVER_COST_ANALYSIS_TAMILNADU.md)** - Deployment and hosting recommendations

## 🔧 Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.3
- **Language**: Java 17
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Database**: PostgreSQL
- **Cache**: Redis
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI, Bootstrap
- **Build Tool**: Create React App

## 🌐 Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Eureka Discovery | 8761 | Service registry dashboard |
| API Gateway | 8764 | Main API entry point |
| Login Service | 8099 | Authentication |
| Patient Service | 8083 | Patient management |
| OPD Service | 8085 | Outpatient department |
| IPD Service | 8084 | Inpatient department |
| Billing Service | 8094 | Billing & payments |
| Admin Service | 8087 | Administration |

## 📋 Services List

### Core Services
- **Discovery Service** - Service registry (Eureka)
- **API Gateway** - Centralized API gateway
- **Login Service** - Authentication and authorization
- **Admin Service** - System administration

### Clinical Services
- **Patient Service** - Patient registration and management
- **OPD Service** - Outpatient department operations
- **IPD Service** - Inpatient department operations
- **OT Service** - Operation theater management
- **Laboratory Service** - Lab test management
- **Blood Bank Service** - Blood bank operations

### Support Services
- **Billing Service** - Billing and payment processing
- **Finance Service** - Financial management
- **Inventory Service** - Inventory and stock management
- **Ambulance Service** - Ambulance management
- **Front Office Service** - Reception and front desk
- **TPA Service** - Third-party administrator
- **Notification Service** - Notifications and alerts
- **Dashboard Service** - Analytics and reporting
- **Birth/Death Service** - Birth and death records

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Secure API endpoints
- Database schema isolation per service

## 🗄️ Database

- **Database Name**: `myappdb`
- **Default User**: `postgres`
- **Schema Pattern**: One schema per microservice
- **Connection Pooling**: HikariCP (10 connections per service)

## 🐳 Docker Support

Docker Compose configuration is provided for:
- PostgreSQL database
- Redis cache

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for details.

## 🚀 Deployment

For production deployment recommendations, see [SERVER_COST_ANALYSIS_TAMILNADU.md](SERVER_COST_ANALYSIS_TAMILNADU.md).

## 📝 Development

### Building Services

```bash
# Build a specific service
cd <service-name>
mvn clean install

# Build all services
# Run from root directory
```

### Running Tests

```bash
cd <service-name>
mvn test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👤 Author

**kumaresonR**

- GitHub: [@kumaresonR](https://github.com/kumaresonR)

## 🙏 Acknowledgments

- Spring Boot team
- React community
- All open-source contributors

---

**Note**: This is a monorepo containing all microservices and the frontend application. For production deployment, consider containerization and orchestration with Kubernetes or Docker Swarm.

