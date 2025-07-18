package com.gradpilot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gradpilot.model.Country;
import com.gradpilot.model.Major;
import com.gradpilot.model.ResearchInterest;
import com.gradpilot.repository.CountryRepository;
import com.gradpilot.repository.MajorRepository;
import com.gradpilot.repository.ResearchInterestRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For testing purposes
public class DropdownController {

    @Autowired
    private MajorRepository majorRepository;

    @Autowired
    private ResearchInterestRepository researchInterestRepository;

    @Autowired
    private CountryRepository countryRepository;

    @GetMapping("/majors")
    public ResponseEntity<List<Major>> getAllMajors() {
        List<Major> majors = majorRepository.findAll();
        return ResponseEntity.ok(majors);
    }

    @GetMapping("/research-interests")
    public ResponseEntity<List<ResearchInterest>> getAllResearchInterests() {
        List<ResearchInterest> interests = researchInterestRepository.findAll();
        return ResponseEntity.ok(interests);
    }

    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        List<Country> countries = countryRepository.findAll();
        return ResponseEntity.ok(countries);
    }
}
