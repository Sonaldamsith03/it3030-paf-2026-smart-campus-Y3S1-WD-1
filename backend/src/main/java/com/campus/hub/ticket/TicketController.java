package com.campus.hub.ticket;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<Ticket> getAllTickets(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String technicianId) {
        if (userId != null) {
            return ticketService.getTicketsByUserId(userId);
        }
        if (technicianId != null) {
            return ticketService.getTicketsByTechnicianId(technicianId);
        }
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(ticket));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable String id, @RequestBody Map<String, String> statusMap) {
        try {
            return ResponseEntity.ok(ticketService.updateTicketStatus(id, statusMap.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(ticketService.assignTechnician(id, body.get("technicianId"), body.get("technicianName")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/self-assign")
    public ResponseEntity<?> selfAssignTicket(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(ticketService.selfAssignTicket(id, body.get("technicianId"), body.get("technicianName")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
