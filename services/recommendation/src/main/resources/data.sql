-- Sample universities data for GradPilot
INSERT INTO universities (name, description, email, ranking, tuition_fees, country, address, website_url) VALUES
('Massachusetts Institute of Technology', 'Premier institution for science and technology', 'admissions@mit.edu', 1, 53790.0, 'USA', 'Cambridge, MA', 'https://www.mit.edu'),
('Stanford University', 'Leading research university in Silicon Valley', 'admission@stanford.edu', 2, 56169.0, 'USA', 'Stanford, CA', 'https://www.stanford.edu'),
('Harvard University', 'Oldest higher education institution in the US', 'college@harvard.edu', 3, 54002.0, 'USA', 'Cambridge, MA', 'https://www.harvard.edu'),
('California Institute of Technology', 'Private research university focusing on science and engineering', 'ugadmissions@caltech.edu', 4, 58680.0, 'USA', 'Pasadena, CA', 'https://www.caltech.edu'),
('University of Oxford', 'Collegiate research university in Oxford, England', 'undergraduate.admissions@ox.ac.uk', 5, 11220.0, 'UK', 'Oxford, England', 'https://www.ox.ac.uk'),
('ETH Zurich', 'Public research university in Zurich, Switzerland', 'admissions@ethz.ch', 6, 1500.0, 'Switzerland', 'Zurich, Switzerland', 'https://ethz.ch'),
('University of Cambridge', 'Public collegiate research university in Cambridge, England', 'admissions@cam.ac.uk', 7, 11220.0, 'UK', 'Cambridge, England', 'https://www.cam.ac.uk'),
('Imperial College London', 'Public research university in London, England', 'admissions@imperial.ac.uk', 8, 35100.0, 'UK', 'London, England', 'https://www.imperial.ac.uk'),
('University College London', 'Public research university in London, England', 'admissions@ucl.ac.uk', 9, 25200.0, 'UK', 'London, England', 'https://www.ucl.ac.uk'),
('University of Chicago', 'Private research university in Chicago, Illinois', 'collegeadmissions@uchicago.edu', 10, 59298.0, 'USA', 'Chicago, IL', 'https://www.uchicago.edu'),
('National University of Singapore', 'Autonomous research university in Singapore', 'admissions@nus.edu.sg', 11, 17550.0, 'Singapore', 'Singapore', 'https://www.nus.edu.sg'),
('Peking University', 'Major research university in Beijing, China', 'admission@pku.edu.cn', 12, 5000.0, 'China', 'Beijing, China', 'https://english.pku.edu.cn'),
('University of Pennsylvania', 'Private Ivy League research university', 'info@admissions.upenn.edu', 13, 63452.0, 'USA', 'Philadelphia, PA', 'https://www.upenn.edu'),
('Tsinghua University', 'Public research university in Beijing, China', 'zsb@tsinghua.edu.cn', 14, 5000.0, 'China', 'Beijing, China', 'https://www.tsinghua.edu.cn'),
('University of Edinburgh', 'Public research university in Edinburgh, Scotland', 'student.recruitment@ed.ac.uk', 15, 23100.0, 'UK', 'Edinburgh, Scotland', 'https://www.ed.ac.uk')
ON CONFLICT (name) DO NOTHING;
