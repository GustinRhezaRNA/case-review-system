# Case Review System

A full-stack application for managing and reviewing cases, built with NestJS and React.

## 🛠 Tech Stack

**Backend**
*   **Framework**: [NestJS](https://nestjs.com/)
*   **Database**: PostgreSQL
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Language**: TypeScript

**Frontend**
*   **Framework**: React (via [Vite](https://vitejs.dev/))
*   **Styling**: Tailwind CSS + Radix UI
*   **Language**: TypeScript

---

## 🚀 Set up and Run Instructions

### Prerequisites
*   Node.js (v18 or later recommended)
*   PostgreSQL installed and running

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    *   Create a `.env` file in the `backend` root.
    *   Add your database connection string:
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/case_review_db?schema=public"
        ```

4.  Setup Database:
    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Run Migrations
    npx prisma migrate dev --name init

    # Seed Database (Optional, if seed script exists)
    npm run prisma:seed
    ```

5.  Start the Backend Server:
    ```bash
    npm run start:dev
    ```
    The server will start on `http://localhost:3000` (default NestJS port).

### 2. Docker Setup (Alternative)

You can also run the backend and database using Docker.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Start the services:
    ```bash
    docker-compose up -d --build
    ```
    This will start:
    *   **Postgres Database**: Port 5432
    *   **Backend API**: Port 3000

    *Note: The docker-compose setup automatically runs migrations and seeds the database.*

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    The application will typically start on `http://localhost:5173`.

---

## 🏗 High-level Architecture Overview

The application follows a standard **Client-Server** architecture:

*   **Frontend (SPA)**: A React application (SPA) served by Vite. It handles the UI, user interactions, and communicates with the backend via RESTful APIs. It relies on standard browser fetch/axios for data retrieval.
*   **Backend (API)**: A NestJS application that serves as the REST API layer. It handles business logic, authentication/authorization, and database interactions.
*   **Database**: PostgreSQL is used as the persistent storage, managed via Prisma ORM for type-safe database queries.

**Data Flow**: `User Action` -> `Frontend (React)` -> `API Request` -> `Backend (NestJS)` -> `Prisma ORM` -> `PostgreSQL`.

---

## 🗄 Database Design

The database schema manages Users, Roles, and Cases. Key entities include:

### Schema Overview

*   **Users (`users`)**: Authenticated users of the system.
    *   Linked to a `Role`.
    *   Can create, be assigned to, or assign cases.
*   **Roles (`roles`)**: Defines permissions (e.g., Administrator, Reviewer).
    *   One-to-Many relationship with Users.
*   **Cases (`cases`)**: The core entity being reviewed.
    *   Has a lifecycle managed by `CaseStatus`.
    *   Tracks `createdBy`, `assignedTo`, and `assignedBy` users.
*   **CaseStatus (`case_statuses`)**: Lookup table for case states (e.g., Open, In Review, Closed).

### Key Relationships

*   **RBAC**: `User` -> `Role` (Many-to-One). A user has one role.
*   **Case Ownership**:
    *   `Case` -> `User` (Created By).
    *   `Case` -> `User` (Assigned To).
    *   `Case` -> `User` (Assigned By).
    *   `Case` -> `CaseStatus` (Status).

### Indexing Decisions

Based on common query patterns:
*   `@@index([createdBy])`: To quickly fetch cases created by a specific user.
*   `@@index([assignedTo])`: To optimize the "My Assigned Cases" dashboard view.
*   `@@index([assignedBy])`: For auditing assignment history.
*   `@@index([statusId])`: For filtering cases by status (e.g., "Show all Open cases").
*   `@@index([createdAt])`: For sorting cases by date (Case feed).

---

## ⚖️ Key Assumptions and Trade-offs

1.  **UUIDs for High-Volume Entities**:
    *   **Decision**: Used standard integer IDs for static lookup tables like `Roles` and `CaseStatuses`, but UUIDs for `Users` and `Cases`.
    *   **Reason**: `Roles` and `Statuses` are static enum-like data where simple IDs suffice. `Users` and `Cases` are high-growth data where UUIDs prevent enumeration attacks and allow for easier distributed generation if needed.

2.  **Separate Frontend/Backend Repositories (Monorepo-ish)**:
    *   **Decision**: Kept `backend` and `frontend` folders distinct in the root.
    *   **Trade-off**: Simpler separation of concerns for deployment (can deploy strictly one or the other). Slightly more overhead to run locally (requires two terminals) compared to a tightly coupled Next.js fullstack app, but offers better scalability if the backend needs to serve other clients (e.g., mobile).

3.  **Client-Side Rendering (CSR)**:
    *   **Decision**: Used Vite (React SPA).
    *   **Trade-off**: Fast transitions and rich interactivity after initial load. SEO might be weaker compared to SSR (Next.js), but presumably, this is an internal dashboard where SEO is not the priority.

4.  **Prisma as ORM**:
    *   **Decision**: Used Prisma.
    *   **Trade-off**: Excellent developer experience and type safety. Adds a build step (generation) and runtime dependency, but significantly reduces SQL errors.

5.  **Pagination for Performance**:
    *   **Decision**: Implemented server-side pagination for case lists.
    *   **Reason**: Fetching all cases at once would degrade performance as the dataset grows. Pagination ensures data is fetched in manageable chunks (lightweight), improving load times and reducing server strain.

