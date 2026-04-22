package com.campus.hub.ticket;

import com.campus.hub.notification.Notification;
import com.campus.hub.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByUserId(String userId) {
        return ticketRepository.findByCreatedBy(userId);
    }

    public List<Ticket> getTicketsByTechnicianId(String technicianId) {
        return ticketRepository.findByAssignedTo(technicianId);
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        ticket.setStatus(status);
        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify user if ticket is resolved or rejected
        if ("RESOLVED".equals(status) || "REJECTED".equals(status)) {
            Notification notification = new Notification();
            notification.setUserId(ticket.getCreatedBy());
            notification.setMessage("Your ticket \"" + ticket.getTitle() + "\" has been " + status + ".");
            notification.setType("RESOLVED".equals(status) ? "SUCCESS" : "ERROR");
            notification.setTimestamp(LocalDateTime.now());
            notificationService.createNotification(notification);
        }

        return savedTicket;
    }

    public Ticket assignTechnician(String id, String technicianId, String technicianName) {
        System.out.println("Assigning technician to ticket ID: " + id);
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> {
                System.out.println("Ticket NOT FOUND in database for ID: " + id);
                return new RuntimeException("Ticket not found with ID: " + id);
            });
        
        System.out.println("Found ticket: " + ticket.getTitle() + ". Assigning to: " + technicianName);
        ticket.setAssignedTo(technicianId);
        ticket.setAssignedToName(technicianName);
        ticket.setAssignedByAdmin(true);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket selfAssignTicket(String id, String technicianId, String technicianName) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (ticket.getAssignedTo() != null) {
            throw new RuntimeException("Ticket is already assigned");
        }

        ticket.setAssignedTo(technicianId);
        ticket.setAssignedToName(technicianName);
        ticket.setAssignedByAdmin(false);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        
        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify Admin
        Notification notification = new Notification();
        notification.setMessage("Technician " + technicianName + " has self-assigned to Ticket: " + (ticket.getTitle() != null ? ticket.getTitle() : ticket.getId()));
        notification.setType("INFO");
        notification.setTimestamp(LocalDateTime.now());
        notificationService.createNotification(notification);

        return savedTicket;
    }
}
