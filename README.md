# Banking Fraud Detection System

A high-performance Java Full Stack application designed to identify suspicious transactions in real time.

## Tech Stack
- **Backend**: Java, Spring Boot, Spring Security, JWT, MySQL, Hibernate
- **Frontend**: React.js (Vite), Axios, Recharts, Framer Motion, Lucide Icons
- **Database**: MySQL

## Features
- **Real-time Monitoring**: Automatically flags transactions based on rules.
- **Fraud Rules**:
  - High Amount (> $10,000)
  - Velocity Check (> 3 transactions in 5 minutes)
  - Location Mismatch (Different from last known location)
- **Email Alerts**: Sends instant notifications when fraud is detected.
- **Admin Dashboard**: Global view of all transactions and alerts.
- **Secure Auth**: JWT-based authentication.

## Getting Started

### Prerequisites
- JDK 17+
- Node.js & npm
- MySQL Server

### Database Setup
1. Create a database named `banking_fraud` in MySQL.
2. Update `backend/src/main/resources/application.properties` with your MySQL username and password.

### Running the Backend
1. Navigate to the `backend` directory.
2. Run `./mvnw spring-boot:run` (or use your IDE).

### Running the Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install`.
3. Run `npm run dev`.
4. Access the app at `http://localhost:5173`.

## UI Preview
- **Login**: Modern glassmorphism design.
- **Dashboard**: Real-time analytics and transaction feeds.
- **Security**: Automated protection layer.
