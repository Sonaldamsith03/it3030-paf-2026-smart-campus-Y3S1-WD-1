package com.campus.hub.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings(@RequestParam(required = false) String userId) {
        if (userId != null) {
            return bookingService.getBookingsByUserId(userId);
        }
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable String id, @RequestBody Map<String, String> statusMap) {
        try {
            return ResponseEntity.ok(bookingService.updateBookingStatus(
                id, 
                statusMap.get("status"),
                statusMap.get("adminEmail"),
                statusMap.get("adminName"),
                statusMap.get("rejectionReason")
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(bookingService.cancelBooking(id, body.get("userId"), body.get("reason")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
