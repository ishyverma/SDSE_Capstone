# Smart Hostel Management System (SDSE Capstone)

A full-stack hostel management application built with modern web technologies, strictly adhering to **Object-Oriented Programming (OOP) concepts**, **SOLID principles**, and established **Software Design Patterns**.

This project serves as a Capstone for Software Design and Software Engineering, demonstrating clean architecture and scalable codebase structures.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** SQLite
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** Tailwind CSS v4

## 🏗 System Architecture & Design Patterns

The codebase is structured to separate concerns, making it highly maintainable, testable, and robust.

### Core Design Patterns Implemented:
1. **Factory Method (`src/factories`)**
   - **Usage:** `UserFactory`
   - **Purpose:** Centralizes and encapsulates the instantiation of `User` objects (e.g., `ADMIN` vs `STUDENT`). Ensures the Single Responsibility Principle by decoupling creation logic from client code.
   
2. **Strategy Pattern (`src/strategies`)**
   - **Usage:** `PaymentContext`, `CreditCardStrategy`, `UPIStrategy`, `CashStrategy`
   - **Purpose:** Allows dynamic swapping of payment processing algorithms without altering the core payment service. Adheres to the Open/Closed Principle.
   
3. **Repository Pattern (`src/repositories`)**
   - **Purpose:** Abstracts database interactions (Prisma queries) from business logic, making it easier to swap out data sources or test services in isolation.

4. **Service Layer (`src/services`)**
   - **Purpose:** Contains the core business logic of the application. It acts as an orchestrator between routes/controllers and repositories.

## 🗄️ Database Models

The Prisma schema (`prisma/schema.prisma`) defines the following core entities:
- **User:** Represents Admins and Students. Associated with Rooms, Payments, and Complaints.
- **Room:** Tracks room capacity, status, and associated occupants.
- **Payment:** Records financial transactions linked to specific users.
- **Complaint:** Manages user-generated issues and their resolution status.

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js and npm (or pnpm/yarn) installed on your system.

### 1. Clone & Install
```bash
# Install dependencies
npm install
```

### 2. Configure Environment
Ensure your `.env` file contains the correct database URL connection string:
```bash
DATABASE_URL="file:./dev.db"
```

### 3. Database Setup (Prisma)
Run the following commands to generate the Prisma client and push the schema to the database:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```text
SDSE_Capstone/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── dev.db                # SQLite database
├── src/
│   ├── app/                  # Next.js App Router (Pages & API routes)
│   ├── factories/            # Factory design patterns
│   ├── lib/                  # Utilities (e.g., Prisma client setup)
│   ├── repositories/         # Database access layer
│   ├── services/             # Core business logic
│   └── strategies/           # Strategy design patterns
└── README.md
```

## 🧠 Software Engineering Principles Applied

- **Encapsulation:** Hiding complex creation logic and API implementations.
- **Abstraction:** Abstracting DB models and payment gateways.
- **Polymorphism:** Handling distinct payment strategies through a common `IPaymentStrategy` interface.
- **Single Responsibility Principle (SRP):** Complete separation of API routing, business logic, data access, and object creation.
- **Open/Closed Principle (OCP):** New payment methods or user types can be introduced with zero changes to existing context handlers.
