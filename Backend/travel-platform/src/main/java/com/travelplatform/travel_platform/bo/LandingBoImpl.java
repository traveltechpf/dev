package com.travelplatform.travel_platform.bo;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelplatform.travel_platform.config.BookingStatus;
import com.travelplatform.travel_platform.config.TripStatus;
import com.travelplatform.travel_platform.dao.TripRepository;
import com.travelplatform.travel_platform.dto.Trip;

@Service
@Transactional
public class LandingBoImpl implements LandingBo {

	@Autowired
	private TripRepository tripRepo;

	@Override
	@Transactional(readOnly = true)
	public List<Trip> listPublishedTrips() throws Throwable{
		return tripRepo.findByStatus(TripStatus.PUBLISHED);
	}

	@Override
	@Transactional(readOnly = true)
	public Trip getTrip(Long id) throws Throwable{
		return tripRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Trip not found"));
	}

	@Override
	public void createTrip(Trip trip) throws Throwable{
		if (trip.getStatus() == null)
			trip.setStatus(TripStatus.PUBLISHED);
		 tripRepo.save(trip);
	}

}
