package com.campus.hub.booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Simple conflict check by date and timeSlot
    boolean existsByResourceIdAndStatusAndDateAndTimeSlot(
        String resourceId, String status, String date, String timeSlot
    );

    List<Booking> findByUserId(String userId);
}
