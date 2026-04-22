# Smart Campus Operations Hub - Ticketing Module (Backend Design)

This document outlines the production-level Spring Boot backend structure for the Maintenance & Incident Ticketing Module.

## 1. Entity Design

### Ticket Entity
```java
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN;

    private String location;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    private String rejectionReason;
    private String resolutionNotes;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Attachment> attachments;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
```

## 2. API Endpoints (Controller)

```java
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest request) {
        return ResponseEntity.ok(ticketService.createTicket(request));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority) {
        return ResponseEntity.ok(ticketService.getFilteredTickets(status, priority));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignTechnician(@PathVariable Long id, @RequestBody AssignRequest request) {
        ticketService.assignTechnician(id, request.getTechnicianId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<Void> resolveTicket(@PathVariable Long id, @RequestBody ResolveRequest request) {
        ticketService.resolveTicket(id, request.getNotes());
        return ResponseEntity.ok().build();
    }
}
```

## 3. Workflow Validation Logic (Service)

```java
@Service
public class TicketService {
    
    public void updateStatus(Long ticketId, TicketStatus newStatus, String notes) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        TicketStatus currentStatus = ticket.getStatus();

        // VALIDATION: Enforce correct status transitions
        if (newStatus == TicketStatus.IN_PROGRESS && currentStatus != TicketStatus.OPEN) {
            throw new IllegalStateException("Can only assign OPEN tickets.");
        }
        
        if (newStatus == TicketStatus.RESOLVED && currentStatus != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only resolve tickets that are IN_PROGRESS.");
        }

        if (newStatus == TicketStatus.CLOSED && currentStatus != TicketStatus.RESOLVED) {
            throw new IllegalStateException("Can only close RESOLVED tickets.");
        }

        ticket.setStatus(newStatus);
        if (notes != null) ticket.setResolutionNotes(notes);
        ticketRepository.save(ticket);
        
        // TRIGGER NOTIFICATION
        notificationService.send(ticket.getCreatedBy(), "Ticket Status Updated: " + newStatus);
    }
}
```

## 4. File Upload Handling

Use `MultipartFile` in the controller and store files in an S3 bucket or local storage, saving the URL in the `Attachment` entity.

```java
@PostMapping("/{id}/attachments")
public ResponseEntity<Void> uploadAttachments(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
    if (files.length > 3) throw new IllegalArgumentException("Max 3 files allowed.");
    // ... storage logic ...
}
```
