package com.travelplatform.travel_platform.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelplatform.travel_platform.config.TripStatus;
import com.travelplatform.travel_platform.dto.Trip;

public interface TripRepository extends JpaRepository<Trip,Long>{
	List<Trip> findByStatus(TripStatus status);
}
