package com.travelplatform.travel_platform.dto;

import java.math.BigDecimal;

import com.travelplatform.travel_platform.config.TripStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "trips")
public class Trip {

	@Id
	@GeneratedValue
	private Long tripId;

	@Column(nullable = false)
	private String title;

	@Column
	private String description;

	@Column
	private String coverImageUrl;

	@Column
	private String locationsCsv;

	@Column
	private Integer durationDays;

	@Column
	private Integer groupSize;

	@Column
	private BigDecimal pricePerPerson;
	
	@Enumerated(EnumType.STRING)
	private TripStatus status = TripStatus.PUBLISHED;

	public Long getTripId() {
		return tripId;
	}

	public void setTripId(Long tripId) {
		this.tripId = tripId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCoverImageUrl() {
		return coverImageUrl;
	}

	public void setCoverImageUrl(String coverImageUrl) {
		this.coverImageUrl = coverImageUrl;
	}

	public String getLocationsCsv() {
		return locationsCsv;
	}

	public void setLocationsCsv(String locationsCsv) {
		this.locationsCsv = locationsCsv;
	}

	public Integer getDurationDays() {
		return durationDays;
	}

	public void setDurationDays(Integer durationDays) {
		this.durationDays = durationDays;
	}

	public Integer getGroupSize() {
		return groupSize;
	}

	public TripStatus getStatus() {
		return status;
	}

	public void setStatus(TripStatus status) {
		this.status = status;
	}

	public void setGroupSize(Integer groupSize) {
		this.groupSize = groupSize;
	}

	public BigDecimal getPricePerPerson() {
		return pricePerPerson;
	}

	public void setPricePerPerson(BigDecimal pricePerPerson) {
		this.pricePerPerson = pricePerPerson;
	}

}
