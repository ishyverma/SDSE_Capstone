# SmartStay Hostel Management System — UML Class Diagram

---

## 1. UML Notation Legend

### Access Modifiers

| Symbol | Meaning                                                           |
| :----: | ----------------------------------------------------------------- |
| `+` | **Public** — accessible from anywhere                      |
| `-` | **Private** — accessible only within the class             |
| `#` | **Protected** — accessible within the class and subclasses |
| `~` | **Package** — accessible within the same module            |
| `$` | **Static** — belongs to the class itself, not instances    |

### Relationships & Arrows

| Mermaid Syntax | UML Name                       |    Visual    | Description                                                      |
| :------------: | ------------------------------ | :----------: | ---------------------------------------------------------------- |
|    `<\|--`    | **Inheritance**          | `───▷` | Solid line + closed triangle. Class extends another.             |
|    `<\|..`    | **Realization**          |  `┄┄▷`  | Dashed line + closed triangle. Class implements an interface.    |
|    `-->`    | **Directed Association** | `───▶` | Solid line + open arrow. A stores B as a field (one-way).        |
|    `o--`    | **Aggregation**          | `◇───` | Solid line + open diamond. "Has-a" — parts exist independently. |
|    `*--`    | **Composition**          | `◆───` | Solid line + filled diamond. "Owns" — parts die with the whole. |
|    `..>`    | **Dependency**           |  `┄┄▶`  | Dashed line + open arrow. Temporary use (not stored as field).   |

### Dependency Stereotypes

| Label          | Meaning                               | Example                                          |
| -------------- | ------------------------------------- | ------------------------------------------------ |
| `«use»`    | Calls methods on B temporarily        | `Repository «use» PrismaClient`              |
| `«create»` | Creates new instances via `new B()` | `PaymentService «create» CreditCardStrategy` |

> [!NOTE]
> `«use»` and `«create»` are **NOT** separate relationship types — they are **labels on the same Dependency arrow** (`..>`) to clarify the nature of the dependency.

---

## 2. Domain Models

> Entities derived from the Prisma schema — shows data structure and how models relate to each other.

```mermaid
classDiagram
    direction TB

    class User {
        +String id
        +String name
        +String email
        +String role
        +DateTime createdAt
        +DateTime updatedAt
        +String roomId_opt
    }

    class Room {
        +String id
        +String roomNo
        +Int capacity
        +String status
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Payment {
        +String id
        +Float amount
        +String status
        +String method_opt
        +DateTime createdAt
        +DateTime updatedAt
        +String userId
    }

    class Complaint {
        +String id
        +String title
        +String description
        +String status
        +DateTime createdAt
        +DateTime updatedAt
        +String userId
    }

    %% Aggregation & Composition
    Room o-- User
    User *-- Payment : 
    User *-- Complaint  
```

| Relationship              | Type                  | Why?                                              |
| ------------------------- | --------------------- | ------------------------------------------------- |
| `Room ◇── User`      | **Aggregation** | Room exists independently and has occupants.      |
| `User ◆── Payment`   | **Composition** | Payment lifecycle depends entirely on the User.   |
| `User ◆── Complaint` | **Composition** | Complaint lifecycle depends entirely on the User. |

---

## 3. Repository Layer

> Abstraction over data access. Repositories use the PrismaClient singleton via `«use»` dependency.

```mermaid
classDiagram
    direction TB


    class PrismaClient {
        <<Singleton>>
        ~PrismaClient globalInstance$
        +user
        +room
        +payment
        +complaint
    }

    class UserRepository {
        +getAllUsers() Promise~User[~]
        +getUserById(id: String) Promise~User | null~
        +createUser(name, email, role) Promise~User~
        +deleteUser(id: String) Promise~boolean~
    }

    class RoomRepository {
        +getAllRooms() Promise~Room[~]
        +createRoom(roomNo, capacity) Promise~Room~
        +assignStudentToRoom(roomId, userId) Promise~User~
        +vacateRoom(userId) Promise~User~
    }

    class PaymentRepository {
        +getAllPayments() Promise~Payment[~]
        +createPaymentRecord(userId, amount, method) Promise~Payment~
    }

    class ComplaintRepository {
        +getAllComplaints() Promise~Complaint[~]
        +createComplaint(userId, title, desc) Promise~Complaint~
        +resolveComplaint(complaintId) Promise~Complaint~
    }


    UserRepository ..> PrismaClient : <<use>>
    RoomRepository ..> PrismaClient : <<use>>
    PaymentRepository ..> PrismaClient : <<use>>
    ComplaintRepository ..> PrismaClient : <<use>>
```

| Relationship                        | Type                         | Why?                                                                                          |
| ----------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| `*Repository ┄┄▶ PrismaClient` | **Dependency «use»** | Repos call `prisma.model.method()` — they use the singleton but don't store it as a field. |

---

## 4. Service Layer

> Business logic layer. Each service holds a **private** reference to its repository (Directed Association) and delegates data operations to it.

```mermaid
classDiagram
    direction TB

    class UserService {
        -UserRepository userRepository
        +getAllUsers() Promise~User[~]
        +registerUser(type, name, email) Promise~User~
    }

    class RoomService {
        -RoomRepository roomRepository
        +getAllRooms() Promise~Room[~]
        +addRoom(roomNo, capacity) Promise~Room~
        +assignRoom(roomId, userId) Promise~User~
        +vacateRoom(userId) Promise~User~
    }

    class PaymentService {
        -PaymentRepository paymentRepository
        +processPayment(userId, amount, method) Promise~Payment~
        +getAllPayments() Promise~Payment[~]
    }

    class ComplaintService {
        -ComplaintRepository complaintRepository
        +getAllComplaints() Promise~Complaint[~]
        +raiseComplaint(userId, title, desc) Promise~Complaint~
        +resolveComplaint(complaintId) Promise~Complaint~
    }

    class UserRepository
    class RoomRepository
    class PaymentRepository
    class ComplaintRepository

    UserService --> UserRepository : -userRepository
    RoomService --> RoomRepository : -roomRepository
    PaymentService --> PaymentRepository : -paymentRepository
    ComplaintService --> ComplaintRepository : -complaintRepository
```

| Relationship                  | Type                           | Why?                                                                                                                                         |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Service ──▶ Repository` | **Directed Association** | Each service stores its repository as a**private field** (`-`). One-way: Service knows Repository, Repository does NOT know Service. |

---

## 5. Factory Pattern — UserFactory

> Encapsulates User creation logic. The `UserService` depends on `UserFactory` via a `«use»` dependency (calls its static method, does not store it).

```mermaid
classDiagram
    direction TB

    class UserFactory {
        <<Factory>>
        +createUser(type, name, email)$ Promise~User~
    }

    class UserService {
        -UserRepository userRepository
        +registerUser(type, name, email) Promise~User~
    }

    class PrismaClient {
        <<Singleton>>
    }

    class User {
        +String id
        +String name
        +String email
        +String role
    }

    UserService ..> UserFactory : <<use>>
    UserFactory ..> PrismaClient : <<use>>
    UserFactory ..> User : <<create>>
```

| Relationship                        | Type                            | Why?                                                                                 |
| ----------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| `UserService ┄┄▶ UserFactory`  | **Dependency «use»**    | Service calls `UserFactory.createUser()` — a static method call, no field stored. |
| `UserFactory ┄┄▶ PrismaClient` | **Dependency «use»**    | Factory calls `prisma.user.create()` internally.                                   |
| `UserFactory ┄┄▶ User`         | **Dependency «create»** | Factory instantiates User records.                                                   |

---

## 6. Strategy Pattern — Payment Processing

> Allows swapping payment algorithms at runtime. `PaymentService` creates (`«create»`) the context and concrete strategies. `PaymentContext` stores the strategy as a private field (Directed Association).

```mermaid
classDiagram
    direction TB

    class IPaymentStrategy {
        <<interface>>
        +pay(amount: Float) Promise~boolean~
    }

    class CreditCardStrategy {
        +pay(amount: Float) Promise~boolean~
    }

    class UPIStrategy {
        +pay(amount: Float) Promise~boolean~
    }

    class CashStrategy {
        +pay(amount: Float) Promise~boolean~
    }

    class PaymentContext {
        -IPaymentStrategy strategy
        +setStrategy(strategy: IPaymentStrategy) void
        +executePayment(amount: Float) Promise~boolean~
    }

    class PaymentService {
        -PaymentRepository paymentRepository
        +processPayment(userId, amount, method) Promise~Payment~
    }

    CreditCardStrategy ..|> IPaymentStrategy : implements
    UPIStrategy ..|> IPaymentStrategy : implements
    CashStrategy ..|> IPaymentStrategy : implements

    PaymentContext --> IPaymentStrategy : 

    PaymentService ..> PaymentContext : <<create>>
    PaymentService ..> CreditCardStrategy : <<create>>
    PaymentService ..> UPIStrategy : <<create>>
    PaymentService ..> CashStrategy : <<create>>
```

| Relationship                               | Type                            | Why?                                                                                        |
| ------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `*Strategy ┄┄▷ IPaymentStrategy`      | **Realization**           | Concrete strategies implement the interface.                                                |
| `PaymentContext ──▶ IPaymentStrategy` | **Directed Association**  | Context stores active strategy as a **private field** (`-strategy`).               |
| `PaymentService ┄┄▶ *Strategy`        | **Dependency «create»** | Service does `new CreditCardStrategy()` etc. — creates instances but doesn't store them. |
| `PaymentService ┄┄▶ PaymentContext`   | **Dependency «create»** | Service does `new PaymentContext(strategy)` — creates it locally per request.            |

---

## 7. Full System Overview (Simplified)

> High-level view showing all layers and how they connect. Classes are simplified to show only the relationship structure.

```mermaid
classDiagram
    direction TB

    %% Domain Models
    class User
    class Room
    class Payment
    class Complaint

    %% Singleton
    class PrismaClient {
        <<Singleton>>
    }

    %% Interfaces 
    class IPaymentStrategy {
        <<interface>>
    }

    %% Repositories 
    class UserRepository
    class RoomRepository
    class PaymentRepository
    class ComplaintRepository

    %% Services 
    class UserService
    class RoomService
    class PaymentService
    class ComplaintService

    %% Factory 
    class UserFactory {
        <<Factory>>
    }

    %% Strategy 
    class CreditCardStrategy
    class UPIStrategy
    class CashStrategy
    class PaymentContext

    %% ═══ Domain Relationships ═══
    Room o-- User : 
    User *-- Payment : 
    User *-- Complaint : 

    %% ═══ Realization ═══
    CreditCardStrategy ..|> IPaymentStrategy
    UPIStrategy ..|> IPaymentStrategy
    CashStrategy ..|> IPaymentStrategy

    %% ═══ Directed Associations ═══
    UserService --> UserRepository
    RoomService --> RoomRepository
    PaymentService --> PaymentRepository
    ComplaintService --> ComplaintRepository
    PaymentContext --> IPaymentStrategy

    %% ═══ Usage Dependencies ═══
    UserRepository ..> PrismaClient : <<use>>
    RoomRepository ..> PrismaClient : <<use>>
    PaymentRepository ..> PrismaClient : <<use>>
    ComplaintRepository ..> PrismaClient : <<use>>
    UserFactory ..> PrismaClient : <<use>>
    UserService ..> UserFactory : <<use>>

    %% ═══ Create Dependencies ═══
    PaymentService ..> PaymentContext : <<create>>
    PaymentService ..> CreditCardStrategy : <<create>>
    PaymentService ..> UPIStrategy : <<create>>
    PaymentService ..> CashStrategy : <<create>>
    UserFactory ..> User : <<create>>
```

---

## 8. Summary Tables

### All Access Modifiers Used

| Modifier | Symbol | Where Used                                                                                                                                                                  |
| :------: | :----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  Public  | `+` | All domain attributes, all repository & service public methods, strategy `pay()`, factory `createUser()$`                                                               |
| Private | `-` | `UserService.userRepository`, `RoomService.roomRepository`, `PaymentService.paymentRepository`, `ComplaintService.complaintRepository`, `PaymentContext.strategy` |
| Package | `~` | `PrismaClient.globalInstance` (module-scoped singleton)                                                                                                                   |
|  Static  | `$` | `UserFactory.createUser()`                                                                                                                                                |

### All Relationship Types Used

| # | Type                            |    Arrow    | Count | Where                                                                |
| :-: | ------------------------------- | :----------: | :---: | -------------------------------------------------------------------- |
| 1 | **Aggregation**           | `◇───` |   1   | Room↔User                                                           |
| 2 | **Composition**           | `◆───` |   2   | User↔Payment, User↔Complaint                                       |
| 3 | **Directed Association**  | `───▶` |   5   | 4× Service→Repository, Context→Strategy                           |
| 4 | **Realization**           |  `┄┄▷`  |   3   | 3× Strategy→IPaymentStrategy                                       |
| 5 | **Dependency «use»**    |  `┄┄▶`  |   6   | 4× Repository→Prisma, Factory→Prisma, Service→Factory            |
| 6 | **Dependency «create»** |  `┄┄▶`  |   5   | PaymentService→Context, PaymentService→3 Strategies, Factory→User |

### Design Patterns

| Pattern                  | Where                 | Key Classes                                                                                         |
| ------------------------ | --------------------- | --------------------------------------------------------------------------------------------------- |
| **Singleton**      | `src/lib/prisma.ts` | `PrismaClient`                                                                                    |
| **Factory Method** | `src/factories/`    | `UserFactory` → `User`                                                                         |
| **Strategy**       | `src/strategies/`   | `IPaymentStrategy`, `CreditCardStrategy`, `UPIStrategy`, `CashStrategy`, `PaymentContext` |
| **Repository**     | `src/repositories/` | `UserRepository`, `RoomRepository`, `PaymentRepository`, `ComplaintRepository`              |
