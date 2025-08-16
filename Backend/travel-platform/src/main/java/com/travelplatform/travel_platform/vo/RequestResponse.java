package com.travelplatform.travel_platform.vo;

import java.util.Map;

public class RequestResponse {
	
	private String message;
	private Boolean hasError;
	private Map<String,Object> model;
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Boolean getHasError() {
		return hasError;
	}
	public void setHasError(Boolean hasError) {
		this.hasError = hasError;
	}
	public Map<String, Object> getModel() {
		return model;
	}
	public void setModel(Map<String, Object> model) {
		this.model = model;
	}
	
}
