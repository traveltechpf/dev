package com.travelplatform.travel_platform.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.travelplatform.travel_platform.dto.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	  List<Booking> findByTripId(Long tripId);
	}
