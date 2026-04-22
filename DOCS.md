# Smart Campus Hub - Technical Documentation

## 1. Requirements Identification

### 1.1 Functional Requirements
*   **User Management & Auth**: Users can log in via Google OAuth2 or credentials. Roles (Student, Admin, Technician) determine access levels.
*   **Facility Booking**: Students can browse availability and book campus halls/labs. Admins can approve or reject these bookings.
*   **Ticketing System**: Students can raise maintenance tickets with image attachments.
*   **Technician Console**: Technicians can self-assign tickets, update progress, and provide resolution notes.
*   **Unified Notifications**: Role-based notifications for booking status updates and ticket assignments.

### 1.2 Non-Functional Requirements
*   **Security**: Role-Based Access Control (RBAC) enforced on both React routes and Spring Boot API endpoints.
*   **Performance**: Fast UI rendering using Vite and optimized Tailwind CSS. Backend responses handled via non-blocking Spring Boot controllers.
*   **Scalability**: Stateless REST API design allowing for horizontal scaling. MongoDB document storage for flexible data schema.
*   **Usability**: Premium, responsive mobile-first design with micro-animations (Framer Motion) and high-contrast accessibility.

---

## 2. Architecture Design

### 2.1 Overall System Architecture
Describes the interaction between the tiered layers of the application.

```mermaid
graph TD
    Client[React Frontend / Vite] -->|HTTPS / REST| API[Spring Boot REST API]
    API -->|Auth| OAuth[Google OAuth2 Service]
    API -->|Data| MongoDB[(MongoDB Atlas)]
    API -->|Email/Alerts| Notify[Notification Service]
```

### 2.2 REST API Architecture (Backend)
Shows the internal request flow within the Spring Boot application.

```mermaid
graph LR
    subgraph Spring Boot
        C[Controller] --> S[Service]
        S --> R[Repository]
        S --> N[Notification Engine]
        Sec[Spring Security] -.->|Intersects| C
    end
    Request --> Sec
```

### 2.3 Frontend Architecture
Describes the React component and state management structure.

```mermaid
graph TD
    subgraph React Application
        Main[App.tsx / Routes] --> Layout[Dashboard Layout]
        Layout --> Nav[Sidebar Navigation]
        Layout --> Page[Feature Pages]
        AuthCtx[Auth Context] -.->|Injects User| Page
        Page --> Serv[Service Layer / Axios]
    end
    Serv -->|API Calls| API[Backend]
```

---

## 3. Implementation Details
*   **Backend**: Spring Boot 3.5.0, MongoDB, Spring Security (JWT-based session extraction).
*   **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide icons, Framer Motion.
*   **Database**: Document-oriented storage in MongoDB for flexible ticketing and booking entities.
