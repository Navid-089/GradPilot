package com.gradpilot.recommendation.service;

import com.gradpilot.recommendation.model.University;
import com.gradpilot.recommendation.repository.UniversityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final UniversityRepository universityRepository;
    
    public DataInitializer(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing sample data...");
        
        // Check if universities already exist
        long count = universityRepository.count();
        if (count > 0) {
            logger.info("Universities already exist in database ({}), skipping initialization", count);
            return;
        }
        
        logger.info("Creating sample universities...");
        
        // Create sample universities
        createUniversity("Massachusetts Institute of Technology", "Premier institution for science and technology", 
                        "admissions@mit.edu", 1, 53790.0, "USA", "Cambridge, MA", "https://www.mit.edu");
                        
        createUniversity("Stanford University", "Leading research university in Silicon Valley", 
                        "admission@stanford.edu", 2, 56169.0, "USA", "Stanford, CA", "https://www.stanford.edu");
                        
        createUniversity("Harvard University", "Oldest higher education institution in the US", 
                        "college@harvard.edu", 3, 54002.0, "USA", "Cambridge, MA", "https://www.harvard.edu");
                        
        createUniversity("California Institute of Technology", "Private research university focusing on science and engineering", 
                        "ugadmissions@caltech.edu", 4, 58680.0, "USA", "Pasadena, CA", "https://www.caltech.edu");
                        
        createUniversity("University of Oxford", "Collegiate research university in Oxford, England", 
                        "undergraduate.admissions@ox.ac.uk", 5, 11220.0, "UK", "Oxford, England", "https://www.ox.ac.uk");
                        
        createUniversity("ETH Zurich", "Public research university in Zurich, Switzerland", 
                        "admissions@ethz.ch", 6, 1500.0, "Switzerland", "Zurich, Switzerland", "https://ethz.ch");
                        
        createUniversity("University of Cambridge", "Public collegiate research university in Cambridge, England", 
                        "admissions@cam.ac.uk", 7, 11220.0, "UK", "Cambridge, England", "https://www.cam.ac.uk");
                        
        createUniversity("Imperial College London", "Public research university in London, England", 
                        "admissions@imperial.ac.uk", 8, 35100.0, "UK", "London, England", "https://www.imperial.ac.uk");
                        
        createUniversity("University College London", "Public research university in London, England", 
                        "admissions@ucl.ac.uk", 9, 25200.0, "UK", "London, England", "https://www.ucl.ac.uk");
                        
        createUniversity("University of Chicago", "Private research university in Chicago, Illinois", 
                        "collegeadmissions@uchicago.edu", 10, 59298.0, "USA", "Chicago, IL", "https://www.uchicago.edu");
        
        long finalCount = universityRepository.count();
        logger.info("Data initialization complete. Created {} universities", finalCount);
    }
    
    private void createUniversity(String name, String description, String email, Integer ranking, 
                                Double tuitionFees, String country, String address, String websiteUrl) {
        try {
            University university = new University(name, description, email, ranking, tuitionFees, country, address, websiteUrl);
            universityRepository.save(university);
            logger.debug("Created university: {}", name);
        } catch (Exception e) {
            logger.error("Failed to create university {}: {}", name, e.getMessage());
        }
    }
}
