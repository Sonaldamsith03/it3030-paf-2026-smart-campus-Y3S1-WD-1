# Smart Campus Operations Hub - System Design & Implementation Guide

This document provides a production-level blueprint for the **Smart Campus Operations Hub** (IT3030 module).

## 1. System Architecture

### High-Level Architecture
The system follows a **Client-Server Architecture** with a decoupled Frontend and Backend.

*   **Frontend:** React.js SPA (Single Page Application) styled with Tailwind CSS.
*   **Backend:** Java Spring Boot REST API (Stateless).
*   **Database:** MongoDB (NoSQL) for flexible document storage (Assets, Bookings, Tickets).
*   **Auth:** OAuth 2.0 (Google) + JWT (JSON Web Tokens) for session management.
*   **Storage:** Cloud Storage (AWS S3 or Firebase Storage) for ticket images.

### Detailed Backend (Spring Boot)
*   **Security Layer:** Spring Security with OAuth2 Client.
*   **Service Layer:** Business logic (Conflict detection, workflow transitions).
*   **Data Access Layer:** Spring Data MongoDB.

---

## 2. Database Schema (MongoDB Collections)

### Users
```json
{
  "_id": "ObjectId",
  "email": "string",
  "name": "string",
  "role": "USER | ADMIN | TECHNICIAN",
  "picture": "string"
}
```

### Resources (Facilities/Assets)
```json
{
  "_id": "ObjectId",
  "name": "string",
  "type": "ROOM | LAB | EQUIPMENT",
  "capacity": "number",
  "location": "string",
  "status": "AVAILABLE | MAINTENANCE | UNAVAILABLE",
  "metadata": "object"
}
```

### Bookings
```json
{
  "_id": "ObjectId",
  "resourceId": "ObjectId",
  "userId": "ObjectId",
  "startTime": "ISODate",
  "endTime": "ISODate",
  "purpose": "string",
  "attendees": "number",
  "status": "PENDING | APPROVED | REJECTED | CANCELLED"
}
```

### Tickets
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "technicianId": "ObjectId",
  "category": "PLUMBING | ELECTRICAL | IT | OTHER",
  "description": "string",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "images": ["string"],
  "status": "OPEN | IN_PROGRESS | RESOLVED | CLOSED",
  "comments": [
    {
      "userId": "ObjectId",
      "text": "string",
      "timestamp": "ISODate"
    }
  ]
}
```

---

## 3. Spring Boot Structure

### Package Organization
*   `com.campus.hub.controller`: REST Endpoints.
*   `com.campus.hub.service`: Business Logic.
*   `com.campus.hub.repository`: MongoDB Repositories.
*   `com.campus.hub.model`: Entities.
*   `com.campus.hub.dto`: Data Transfer Objects (Request/Response).
*   `com.campus.hub.config`: Security & OAuth2 config.

### Sample Entity (Booking.java)
```java
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String resourceId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
}
```

---

## 4. REST API Endpoints

| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| GET | `/api/resources` | List all assets | ANY |
| POST | `/api/bookings` | Create booking | USER |
| GET | `/api/bookings/pending` | List pending bookings | ADMIN |
| PATCH | `/api/bookings/{id}/status` | Approve/Reject | ADMIN |
| POST | `/api/tickets` | Report incident | USER |
| PATCH | `/api/tickets/{id}/assign` | Assign technician | ADMIN |

---

## 5. Booking Conflict Detection Logic (CRITICAL)

To prevent overlapping bookings, use the following query logic in your Service layer:

```java
public boolean hasConflict(String resourceId, LocalDateTime start, LocalDateTime end) {
    // A conflict exists if an existing booking:
    // (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
    return bookingRepository.existsByResourceIdAndStatusAndStartTimeBeforeAndEndTimeAfter(
        resourceId, BookingStatus.APPROVED, end, start
    );
}
```

---

## 6. Ticket Workflow Logic

1.  **Creation:** Status = `OPEN`.
2.  **Assignment:** Admin assigns a Technician -> Status = `IN_PROGRESS`.
3.  **Resolution:** Technician marks as fixed -> Status = `RESOLVED`.
4.  **Closure:** User or Admin confirms -> Status = `CLOSED`.

---

## 7. Security Configuration (OAuth + Roles)

In `SecurityConfig.java`:
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/tech/**").hasRole("TECHNICIAN")
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo -> userInfo
                .oidcUserService(this.oidcUserService())
            )
        );
    return http.build();
}
```

---

## 8. File Upload Handling

*   Use `MultipartFile` in Controller.
*   Store files in **Firebase Storage** or **AWS S3**.
*   Store only the **URL** in MongoDB.

---

## 9. React Frontend Structure

*   `/src/components/common`: Navbar, Sidebar, Button, Modal.
*   `/src/components/dashboard`: StatCards, RecentActivity.
*   `/src/pages`: Home, Bookings, Tickets, AdminPanel.
*   `/src/services`: `api.ts` (Axios instance), `authService.ts`.

---

## 10. UI/UX Suggestions

*   **Dashboard:** Use a "Bento Grid" layout for quick stats.
*   **Booking:** Use a Calendar View (FullCalendar) to visualize availability.
*   **Tickets:** Use a Kanban Board (Drag & Drop) for status updates.
*   **Theme:** Professional "Campus Blue" with high contrast for accessibility.

---

## 11. Validation & Error Handling

*   **Backend:** Use `@Valid` and `@NotNull` with a `GlobalExceptionHandler` (`@ControllerAdvice`).
*   **Frontend:** Use `react-hook-form` with `zod` for schema validation.

---

## 12. Testing Strategy

*   **Unit Tests:** JUnit 5 + Mockito for Services.
*   **Integration Tests:** `@SpringBootTest` with Testcontainers (MongoDB).
*   **API Testing:** Postman Collection with environment variables for JWT tokens.

---

## 13. GitHub Workflow

*   **Branching:** `main` (production), `develop` (integration), `feature/*` (tasks).
*   **CI/CD:** GitHub Action to run `mvn test` and `npm run build` on every PR.

---

## 14. Additional Features for Grading

1.  **QR Code Integration:** Generate QR codes for assets to quickly open the booking/ticket page.
2.  **Analytics Dashboard:** Show most used rooms or frequent maintenance issues.
3.  **Email/Push Notifications:** Use SendGrid or Firebase Cloud Messaging.
4.  **Dark Mode:** A must-have for modern web apps.
