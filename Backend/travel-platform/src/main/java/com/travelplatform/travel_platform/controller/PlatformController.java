package com.travelplatform.travel_platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class PlatformController {
	
	@GetMapping("/")
	public ModelAndView home() {
	    ModelAndView mv = new ModelAndView("index"); // resolves index.jsp
	    mv.addObject("moduleType", "LANDING");
	    return mv;
	}
}