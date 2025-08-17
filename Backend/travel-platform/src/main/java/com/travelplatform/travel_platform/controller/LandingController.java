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
}
