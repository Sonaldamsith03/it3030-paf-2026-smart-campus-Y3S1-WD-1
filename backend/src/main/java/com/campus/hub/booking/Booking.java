package com.campus.hub.booking;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String resourceId;
    private String resourceName;
    private String userId;
    private String userName;
    private String userRole;
    @org.springframework.data.mongodb.core.mapping.Field("date")
    private String date;
    @org.springframework.data.mongodb.core.mapping.Field("timeSlot")
    private String timeSlot;
    private String purpose;
    private int attendees;
    private String status; // PENDING | APPROVED | REJECTED | CANCELLED
    private String rejectionReason;
    private LocalDateTime createdAt;

    public Booking() {
        this.createdAt = LocalDateTime.now();
    }

    public Booking(String id, String resourceId, String resourceName, String userId, String userName, String userRole, String date, String timeSlot, String purpose, int attendees, String status) {
        this.id = id;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.date = date;
        this.timeSlot = timeSlot;
        this.purpose = purpose;
        this.attendees = attendees;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getAttendees() { return attendees; }
    public void setAttendees(int attendees) { this.attendees = attendees; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
