package com.travelplatform.travel_platform.bo;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.travelplatform.travel_platform.config.BookingStatus;
import com.travelplatform.travel_platform.config.TripStatus;
import com.travelplatform.travel_platform.dao.BookingRepository;
import com.travelplatform.travel_platform.dao.TripRepository;
import com.travelplatform.travel_platform.dto.Booking;
import com.travelplatform.travel_platform.dto.Trip;

@Service
@Transactional
public class LandingBoImpl implements LandingBo {

	@Autowired
	private TripRepository tripRepo;

	@Autowired
	private BookingRepository bookingRepo;

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

	@Override
	public Booking createBooking(Long tripId, String userName, String userEmail, Integer numberOfPeople) throws Throwable{
		if (numberOfPeople == null || numberOfPeople <= 0) {
			throw new IllegalArgumentException("numberOfPeople must be > 0");
		}
		Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new NoSuchElementException("Trip not found"));
		BigDecimal total = trip.getPricePerPerson().multiply(BigDecimal.valueOf(numberOfPeople));

		Booking b = new Booking();
		b.setTrip(trip);
		b.setUserName(userName);
		b.setUserEmail(userEmail);
		b.setNumberOfPeople(numberOfPeople);
		b.setStatus(BookingStatus.CONFIRMED); // MVP auto-confirm
		b.setTotalAmount(total);

		return bookingRepo.save(b);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Booking> listBookingsByTrip(Long tripId) throws Throwable{
		return bookingRepo.findByTripId(tripId);
	}

	@Override
	public void cancelBooking(Long bookingId) throws Throwable{
		Booking b = bookingRepo.findById(bookingId).orElseThrow(() -> new NoSuchElementException("Booking not found"));
		b.setStatus(BookingStatus.CANCELLED);
	}

}
