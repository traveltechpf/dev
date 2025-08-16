package com.travelplatform.travel_platform.bo;

import java.util.List;
import com.travelplatform.travel_platform.dto.Booking;
import com.travelplatform.travel_platform.dto.Trip;

public interface LandingBo {
	
	public List<Trip> listPublishedTrips()throws Throwable;
	public Trip getTrip(Long id)throws Throwable;
	public void createTrip(Trip trip)throws Throwable;
	public Booking createBooking(Long tripId, String userName, String userEmail, Integer numberOfPeople)throws Throwable;
	public List<Booking> listBookingsByTrip(Long tripId)throws Throwable;
	public void cancelBooking(Long bookingId)throws Throwable;
	
}
