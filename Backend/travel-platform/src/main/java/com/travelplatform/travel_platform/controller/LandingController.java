package com.travelplatform.travel_platform.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelplatform.travel_platform.bo.LandingBo;
import com.travelplatform.travel_platform.dto.Booking;
import com.travelplatform.travel_platform.dto.Trip;
import com.travelplatform.travel_platform.vo.RequestResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LandingController {

	private static final Logger LOGGER = LoggerFactory.getLogger(LandingController.class);

	@Autowired
	private LandingBo landingBo;

	@GetMapping("/trips")
	public RequestResponse listTrips() {
		var rr = new RequestResponse();
		try {
			rr.setHasError(false);
			rr.setModel(Map.of("trips", landingBo.listPublishedTrips()));
			rr.setMessage("OK");
		} catch (Throwable e) {
			rr.setHasError(true);
			rr.setMessage("Data fetch unsuccessful");
		}
		return rr;
	}

	@GetMapping("/trips/{id}")
	public RequestResponse getTrip(@PathVariable Long id) {
		var rr = new RequestResponse();
		try {
			rr.setHasError(false);
			rr.setModel(Map.of("trip", landingBo.getTrip(id)));
			rr.setMessage("OK");
		} catch (Throwable e) {
			rr.setHasError(true);
			rr.setMessage("Data fetch Unsuccessful");
		}
		return rr;
	}

	@PostMapping("/trips")
	public RequestResponse createTrip(@RequestBody Trip trip) {
		var rr = new RequestResponse();
		try {
			landingBo.createTrip(trip);
			rr.setHasError(false);
			rr.setMessage("Created");
		} catch (Throwable e) {
			rr.setHasError(true);
			rr.setMessage("Error " + e.getMessage());
		}
		return rr;
	}

	@PostMapping("/bookings")
	public RequestResponse createBooking(@RequestBody Map<String, Object> body) {
		var rr = new RequestResponse();
		try {
			Long tripId = Long.valueOf(body.get("tripId").toString());
			String userName = body.get("userName").toString();
			String userEmail = body.get("userEmail").toString();
			Integer numberOfPeople = Integer.valueOf(body.get("numberOfPeople").toString());

			Booking saved = landingBo.createBooking(tripId, userName, userEmail, numberOfPeople);

			rr.setHasError(false);
			rr.setModel(Map.of("bookingId", saved.getId(), "status", saved.getStatus(), "totalAmount",
					saved.getTotalAmount()));
			rr.setMessage("Booked");
		} catch (Throwable e) {
			rr.setHasError(true);
			rr.setMessage("Error while booking " + e.getMessage());
		}
		return rr;
	}

	@GetMapping("/trips/{id}/bookings")
	public RequestResponse listBookings(@PathVariable Long id) {
		var rr = new RequestResponse();
		try {
			rr.setHasError(false);
			rr.setModel(Map.of("bookings", landingBo.listBookingsByTrip(id)));
			rr.setMessage("OK");
		}catch(Throwable e) {
			rr.setHasError(true);
			rr.setMessage("Error "+e.getMessage());
		}
		return rr;
	}

	@PostMapping("/bookings/{bookingId}/cancel")
	public RequestResponse cancel(@PathVariable Long bookingId) {
		var rr = new RequestResponse();
		try {
			landingBo.cancelBooking(bookingId);
			rr.setHasError(false);
			rr.setModel(Map.of("bookingId", bookingId));
			rr.setMessage("Cancelled");
		}catch(Throwable e) {
			rr.setHasError(true);
			rr.setMessage("Error "+e.getMessage());
		}
		return rr;
	}

}
