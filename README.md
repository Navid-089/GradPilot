# GradPilot Backend

This is the backend for the GradPilot project. It is a RESTful API built using Spring Boot and PostgreSQL.

---

## Setup

### PostgreSQL Database

1. **Install PostgreSQL**

   **Ubuntu:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

   **macOS (Homebrew):**
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. **Create a new database and user**

   Launch PostgreSQL shell:
   ```bash
   sudo -u postgres psql
   ```

   Inside the shell, run:
   ```sql
   CREATE DATABASE gradpilot;
   CREATE USER gradpilot_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE gradpilot TO gradpilot_user;
   \q
   ```

3. **(Optional) Restore from SQL dump**

   If you have a dump file:
   ```bash
   psql -U gradpilot_user -d gradpilot -f gradpilot_dump.sql
   ```

### Running the server

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/gradpilot-backend.git
   cd gradpilot-backend
   ```

2. **Configure database connection**

   Open `src/main/resources/application.properties` and add:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/gradpilot
   spring.datasource.username=gradpilot_user
   spring.datasource.password=secure_password

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   server.port=8080
   ```

3. **Build and run the application**

   ```bash
   ./mvnw spring-boot:run
   ```

   Or to package as JAR:
   ```bash
   ./mvnw clean package
   java -jar target/gradpilot-backend-0.0.1-SNAPSHOT.jar
   ```

4. **Accessing the API**

   Visit:
   ```
   http://localhost:8080
   ```

---

## API Documentation


## Authentication

### Sign Up & Create Profile
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/auth/register`
- **Description**: Registers a new user and creates their GradPilot profile.

**Request**
```json
{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "securepass123",
  "gpa": 3.85,
  "testScores": {
    "GRE": 320,
    "IELTS": 7.5
  },
  "targetCountries": ["USA", "Canada"],
  "targetMajors": ["Computer Science", "AI"],
  "researchInterests": ["Machine Learning", "NLP"],
  "deadlineYear": 2026
}
```
**Response**
```json
{
  "message": "Registration successful",
  "user": {
    "userId": "12",
    "name": "John Doe",
    "email": "student@example.com"
  },
  "token": "JWT_TOKEN"
}
```
- **Status**: 201
- **All authenticated endpoints require a valid JWT** token to be passed in the **request header** using the following format:

```
Authorization: Bearer JWT_TOKEN
```

### Login
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Description**: Authenticates a user and returns a JWT token.

**Request**
```json
{
  "email": "student@example.com",
  "password": "securepass123"
}
```
**Response**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "userId": "12",
    "name": "John Doe",
    "email": "student@example.com"
  }
}


```


- **Status**: 200

- **All authenticated endpoints require a valid JWT** token to be passed in the **request header** using the following format:

```
Authorization: Bearer JWT_TOKEN
```

### Logout
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/auth/logout`
- **Description**: Logs out the authenticated user. The JWT token must be provided in the `Authorization` header.

**Response**
```json
{
  "message": "Logged out successfully"
}
```
- **Status**: 200

### Update Profile
- **HTTP Method**: PATCH
- **Endpoint**: `/api/v1/profile/update`
- **Description**: Updates the user's GradPilot profile information.

**Request**
```json
{
  "gpa": 3.9,
  "targetCountries": ["Germany"],
  "researchInterests": ["Bioinformatics"]
}
```
**Response**
```json
{
  "message": "Profile updated successfully"
}
```
- **Status**: 200

### Change Password
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/auth/change-password`
- **Description**: Allows users to change their password.

**Request**
```json
{
  "oldPassword": "securepass123",
  "newPassword": "newsecurepass456"
}
```
**Response**
```json
{
  "message": "Password changed successfully"
}
```
- **Status**: 200

---
## University Matches

### Get Matched Universities
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/universities/match`
- **Description**: Retrieves a ranked list of best-fit universities for the currently authenticated user based on their stored profile.

**Response**
```json
{
  "totalResults": 42,
  "recommendations": [
    {
      "universityId": "1",
      "name": "MIT",
      "score": 0.97,
      "matchedResearch": ["Deep Learning"],
      "tuition": 29500,
      "deadline": "2025-12-01",
      "website": "https://web.mit.edu"
    },
    {
      "universityId": "3",
      "name": "Stanford University",
      "score": 0.94,
      "matchedResearch": ["AI"],
      "tuition": 30000,
      "deadline": "2025-11-15",
      "website": "https://www.stanford.edu"
    }
  ]
}
```
- **Status**: 200

### Save University
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/tracker/save`
- **Description**: Saves a university to the authenticated user's application tracker.

**Request**
```json
{
  "type": "university",
  "id": "1"
}
```
**Response**
```json
{
  "message": "University saved to tracker"
}
```
- **Status**: 200

---

## Professor & Research Explorer

### Get Suggested Professors
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/professors/suggestions`
- **Description**: Retrieves a list of professors based on the stored research interests in the user's profile. Results may be limited to matched universities or include global suggestions depending on backend logic.

**Response**
```json
{
  "totalResults": 25,
  "professors": [
    {
      "profId": "19",
      "name": "Dr. Alice Smith",
      "email": "alice@university.edu",
      "university": "Harvard University",
      "researchAreas": ["Bioinformatics"],
      "googleScholar": "https://scholar.google.com/citations?user=alice",
      "labLink": "http://lab.harvard.edu/alice",
      "recentPapers": [
        "Genomic Analysis of Pathogens",
        "AI for Protein Folding"
      ]
    },
    {
      "profId": "231",
      "name": "Dr. Bob Johnson",
      "email": "bob@stanford.edu",
      "university": "Stanford University",
      "researchAreas": ["Machine Learning", "NLP"],
      "googleScholar": "https://scholar.google.com/citations?user=bob",
      "labLink": "http://ml.stanford.edu/bob",
      "recentPapers": [
        "Transformer Models in Natural Language Processing",
        "Deep Learning for Text Classification"
      ]
    }
  ]
}
```
- **Status**: 200

### Save Professor
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/tracker/save`
- **Description**: Saves a professor to the authenticated user's application tracker.

**Request**
```json
{
  "type": "professor",
  "id": "231"
}
```
**Response**
```json
{
  "message": "Professor saved to tracker"
}
```
- **Status**: 200


---

## Scholarships Finder

### Get Recommended Scholarships
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/scholarships/recommend`
- **Description**: Returns a list of scholarships based on nationality, degree level, and academic field.


**Response**
```json
{
  "totalResults": 18,
  "scholarships": [
    {
      "scholarshipId": "1",
      "title": "Fulbright Foreign Student Program",
      "provider": "USA Government",
      "amount": "Full tuition + stipend",
      "deadline": "2025-05-15",
      "applyLink": "https://foreign.fulbrightonline.org"
    },
    {
      "scholarshipId": "122",
      "title": "DAAD EPOS Scholarships",
      "provider": "DAAD",
      "amount": "Monthly allowance + travel + insurance",
      "deadline": "2025-10-31",
      "applyLink": "https://www.daad.de/en/study-and-research-in-germany/scholarships/"
    }
  ]
}
```
- **Status**: 200

### Save Scholarship
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/scholarships/save`
- **Description**: Saves a scholarship to the authenticated user's saved list.


**Request**
```json
{
  "scholarshipId": "1"
}
```
**Response**
```json
{
  "message": "Scholarship saved successfully"
}
```
- **Status**: 200

### Apply to Scholarship
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/scholarships/apply`
- **Description**: Marks a scholarship as applied for the authenticated user.


**Request**
```json
{
  "scholarshipId": "122"
}
```
**Response**
```json
{
  "message": "Scholarship marked as applied"
}
```
- **Status**: 200

---


## Application Planner

### Get Timeline Events
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/timeline/events`
- **Description**: Retrieves all timeline events (auto-generated and personal) for the authenticated user.


**Response**
```json
{
  "events": [
    {
      "eventId": "1231",
      "title": "Send SOP draft",
      "date": "2025-10-01",
      "type": "SOP"
    },
    {
      "eventId": "1333",
      "title": "Scholarship Deadline",
      "date": "2025-11-15",
      "type": "scholarship"
    }
  ]
}
```
- **Status**: 200

### Add Personal Reminder
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/timeline/add`
- **Description**: Adds a personal reminder to the user's timeline.


**Request**
```json
{
  "title": "Submit Letter of Recommendation",
  "date": "2025-09-20"
}
```
**Response**
```json
{
  "eventId": "1334",
  "message": "Reminder added successfully"
}
```
- **Status**: 201 


--- 

## SOP & LOR Peer Review

### Post a Draft
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/peer-review/post`
- **Description**: Posts an SOP or LOR draft for review with optional tags.


**Request**
```json
{
  "title": "My Statement of Purpose",
  "content": "I am applying to...",
  "tags": ["Review Needed", "SOP"]
}
```
**Response**
```json
{
  "draftId": "901",
  "message": "Draft posted successfully"
}
```
- **Status**: 201

### Comment on a Draft
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/peer-review/comment`
- **Description**: Adds a comment to another user's draft.


**Request**
```json
{
  "draftId": "901",
  "commentId": "19991",
  "comment": "You should clarify your research goal here."
}
```
**Response**
```json
{
  "message": "Comment posted successfully"
}
```
- **Status**: 201


### Get All Drafts
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/peer-review/drafts`
- **Description**: Retrieves all peer review drafts with tags and associated comments.


**Response**
```json
{
  "drafts": [
    {
      "draftId": "1231",
      "title": "My SOP",
      "tags": ["SOP", "Review Needed"],
      "comments": [
        {
          "commentId": "101",
          "user": "mentor_jane",
          "text": "You could elaborate more on your past research."
        },
        {
          "commentId": "102",
          "user": "peer_bob",
          "text": "Nice start, but the conclusion feels abrupt."
        }
      ]
    }
  ]
}
```
- **Status**: 200

---


## AI Chatbot 

### Ask a Question
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/chatbot/ask`
- **Description**: Sends a user question to the AI-powered GradPilot chatbot and receives a helpful response.

**Request**
```json
{
  "question": "Is MIT suitable for AI research?"
}
```
**Response**
```json
{
  "response": "Yes, MIT is a leading institution for AI research, especially with labs like CSAIL."
}
```
- **Status**: 200

--- 

## Application Progress

### Get Application Progress
- **HTTP Method**: GET
- **Endpoint**: `/api/v1/progress/view`
- **Description**: Returns saved universities and professors with their completion status.


**Response**
```json
{
  "universities": [
    {
      "universityId": "1001",
      "name": "MIT",
      "status": "in progress"
    },
    {
      "universityId": "1002",
      "name": "Stanford University",
      "status": "completed"
    }
  ],
  "professors": [
    {
      "profId": "3001",
      "name": "Dr. Alice Smith",
      "university": "Harvard University",
      "status": "in progress"
    }
  ]
}
```
- **Status**: 200

### Mark Task as Completed
- **HTTP Method**: POST
- **Endpoint**: `/api/v1/progress/complete`
- **Description**: Marks a university or professor task as completed for the user.

**Request**
```json
{
  "type": "university",
  "id": "1001"
}
```
**Response**
```json
{
  "message": "Task marked as completed"
}
```
- **Status**: 200

---
