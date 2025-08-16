package com.travelplatform.travel_platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PlatformController {
	
	@GetMapping({"/", "/trips/**", "/book/**"})
	  public String index() {
	    // index.html must be in static/
	    return "forward:/index.html";
	  }

}