# GradPilot Signup API Test Cases for Postman

## Endpoint Information
- **URL**: `http://localhost:8182/api/v1/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Quick Setup Guide
1. **Import Collection**: Use the JSON collection at the bottom of this file
2. **Set Environment**: Create environment with `baseUrl = http://localhost:8182`
3. **Run Tests**: Execute individual requests or run entire collection

## Test Case 1: Minimal Valid Registration ✅

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Expected Response (201 Created)
```json
{
  "message": "Registration successful",
  "user": {
    "userId": "123",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Postman Tests
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success message", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.equal("Registration successful");
});

pm.test("Response has user info", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.user).to.have.property('userId');
    pm.expect(jsonData.user).to.have.property('name');
    pm.expect(jsonData.user).to.have.property('email');
});

pm.test("Response has JWT token", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.token).to.be.a('string');
    pm.expect(jsonData.token.length).to.be.greaterThan(50);
});
```

## Test Case 2: Registration with Basic Selections ✅

### Request Body (JSON)
```json
{
  "name": "Simple Test",
  "email": "simple.test@example.com",
  "password": "password123",
  "targetCountries": [1],
  "targetMajors": [1],
  "researchInterests": [1]
}
```

### Expected Response (201 Created)
```json
{
  "message": "Registration successful",
  "user": {
    "userId": "124",
    "name": "Simple Test",
    "email": "simple.test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

## Test Case 3: Full Registration with All Fields ✅

### Request Body (JSON)
```json
{
  "name": "John Doe Full",
  "email": "john.doe.full@example.com",
  "password": "securePassword123",
  "gpa": 3.75,
  "targetCountries": [1, 2, 5],
  "targetMajors": [1, 2, 6],
  "researchInterests": [1, 2, 5, 14],
  "deadlineYear": 2025
}
```

### Expected Response (201 Created)
```json
{
  "message": "Registration successful",
  "user": {
    "userId": "125",
    "name": "John Doe Full",
    "email": "john.doe.full@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

## Test Case 4: Registration with Test Scores ✅

### Request Body (JSON)
```json
{
  "name": "Test Score User",
  "email": "testscore@example.com",
  "password": "password123",
  "gpa": 3.9,
  "testScores": {
    "GRE": "325",
    "IELTS": "8.5",
    "TOEFL": "110"
  },
  "targetCountries": [1, 5],
  "targetMajors": [1, 2],
  "researchInterests": [1, 7, 14],
  "deadlineYear": 2026
}
```

### Expected Response (201 Created)
```json
{
  "message": "Registration successful",
  "user": {
    "userId": "126",
    "name": "Test Score User",
    "email": "testscore@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

## Test Case 5: Dynamic Email Generation (Pre-request Script)

### Pre-request Script
```javascript
// Generate unique email to avoid duplicates
const timestamp = Date.now();
const randomNum = Math.floor(Math.random() * 1000);
const uniqueEmail = `testuser${timestamp}${randomNum}@example.com`;
pm.environment.set("uniqueEmail", uniqueEmail);
```

### Request Body (JSON)
```json
{
  "name": "Dynamic User",
  "email": "{{uniqueEmail}}",
  "password": "password123",
  "gpa": 3.5
}
```

## Test Case 6: Invalid Email Format (400 Error)

### Request Body (JSON)
```json
{
  "name": "Invalid User",
  "email": "invalid-email",
  "password": "password123"
}
```

### Expected Response (400 Bad Request)
```json
{
  "timestamp": "2025-07-19T...",
  "status": 400,
  "error": "Bad Request",
  "message": "Email format is invalid. Domain must be lowercase and properly formatted.",
  "path": "/api/v1/auth/register"
}
```

### Postman Tests
```javascript
pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
});

pm.test("Error message for invalid email", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("Email format is invalid");
});
```

## Test Case 7: Password Too Short (400 Error)

### Request Body (JSON)
```json
{
  "name": "Short Pass",
  "email": "short@example.com",
  "password": "123"
}
```

### Expected Response (400 Bad Request)
```json
{
  "timestamp": "2025-07-19T...",
  "status": 400,
  "error": "Bad Request",
  "message": "Password must be at least 6 characters long",
  "path": "/api/v1/auth/register"
}
```

## Test Case 8: Missing Required Fields (400 Error)

### Request Body (JSON)
```json
{
  "email": "missing@example.com",
  "password": "password123"
}
```

### Expected Response (400 Bad Request)
```json
{
  "timestamp": "2025-07-19T...",
  "status": 400,
  "error": "Bad Request",
  "message": "Name is required",
  "path": "/api/v1/auth/register"
}
```

## Test Case 9: GPA Out of Range (400 Error)

### Request Body (JSON)
```json
{
  "name": "High GPA",
  "email": "highgpa@example.com",
  "password": "password123",
  "gpa": 5.0
}
```

### Expected Response (400 Bad Request)
```json
{
  "timestamp": "2025-07-19T...",
  "status": 400,
  "error": "Bad Request",
  "message": "GPA cannot exceed 4.0",
  "path": "/api/v1/auth/register"
}
```

## Test Case 10: Invalid Year Range (400 Error)

### Request Body (JSON)
```json
{
  "name": "Future Year",
  "email": "future@example.com",
  "password": "password123",
  "deadlineYear": 2040
}
```

### Expected Response (400 Bad Request)
```json
{
  "timestamp": "2025-07-19T...",
  "status": 400,
  "error": "Bad Request",
  "message": "Deadline year cannot be too far in future",
  "path": "/api/v1/auth/register"
}
```

## Test Case 11: Duplicate Email (409 Error)

### Request Body (JSON)
```json
{
  "name": "Duplicate User",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Expected Response (409 Conflict)
```json
{
  "error": "Bad Request",
  "message": "Registration failed: Email already exists",
  "timestamp": "2025-07-19T...",
  "status": 400
}
```

### Postman Tests
```javascript
pm.test("Status code is 400 for duplicate email", function () {
    pm.response.to.have.status(400);
});

pm.test("Error message for duplicate email", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("Email already exists");
});
```

## Test Case 12: Invalid Country ID (Edge Case)

### Request Body (JSON)
```json
{
  "name": "Invalid Country",
  "email": "invalidcountry@example.com",
  "password": "password123",
  "targetCountries": [999]
}
```

### Note
This should either succeed (ignoring invalid IDs) or return validation error depending on backend implementation.

## Test Case 13: Empty Arrays (Edge Case)

### Request Body (JSON)
```json
{
  "name": "Empty Arrays",
  "email": "empty@example.com",
  "password": "password123",
  "targetCountries": [],
  "targetMajors": [],
  "researchInterests": []
}
```

### Expected Response (201 Created)
Should succeed as empty arrays are valid.

## Test Case 14: Maximum Length Fields

### Request Body (JSON)
```json
{
  "name": "Very Long Name That Tests The Maximum Length Validation For Name Field In Database Schema",
  "email": "maxlength@example.com",
  "password": "password123"
}
```

### Note
Tests the 100-character limit for name field.

## Reference Data for Testing (CURRENT DATABASE VALUES ✅)

### Available Target Countries (IDs) 
- 1: United States
- 2: Canada  
- 5: United Kingdom
- 6: Australia
- 7: South Korea
- 8: Malaysia
- 9: Ireland
- 10: Saudi Arabia

### Available Target Majors (IDs)
- 1: Computer Science
- 2: AI
- 4: CS
- 5: CSE
- 6: Bioinformatics
- 7: Cybersecurity
- 8: bioinformatics
- 10: HCI
- 11: NAME
- 12: BME
- 13: WRE
- 14: URP

### Available Research Interests (IDs)
- 1: Machine Learning
- 2: NLP
- 3: Information Security
- 4: Cryptology  
- 5: Computational Biology
- 6: Geodesic geometry
- 7: AI
- 8: Bioinformatics
- 9: Computer Science
- 10: Cybersecurity
- 11: Rights Management
- 12: BioInformatics
- 13: Parallel & Secure Algorithms
- 14: HCI
- 15: Embedded & Cyber-Physical Systems
- 16: Energy‑Aware Computing
- 17: Formal Verification
- 18: Post‑Silicon Debug; SoC Validation
- 19: Hardware Security & Trust
- 20: Quantum Computing
- 21: Advanced interaction technologies
- 22: Assurable Software Architecture
- 23: Affective Computing
- 24: Physiological Signal Processing
- 25: Emotion Recognition
- 26: Thermal Imaging
- 27: Wellness Monitoring
- 28: Intrusion Detection
- 29: Data Science
- 30: Algorithms

## Global Test Scripts

### Collection Pre-request Script
```javascript
// Set base URL if not already set
if (!pm.environment.get("baseUrl")) {
    pm.environment.set("baseUrl", "http://localhost:8182");
}

// Generate unique identifier for this test run
if (!pm.environment.get("testRunId")) {
    pm.environment.set("testRunId", Date.now());
}
```

### Collection Test Script
```javascript
// Global tests that run after every request
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has valid JSON", function () {
    try {
        pm.response.json();
    } catch (e) {
        pm.expect.fail("Response is not valid JSON");
    }
});

// Log response for debugging
console.log("Response:", pm.response.json());
```

## Quick Import Instructions

### Method 1: Direct Collection Import
1. Copy the JSON collection above
2. In Postman, click **Import** 
3. Select **Raw text** and paste the JSON
4. Click **Continue** → **Import**

### Method 2: Manual Setup
1. Create a new Collection named "GradPilot Signup API Tests"
2. Add environment variable: `baseUrl = http://localhost:8182`
3. Create requests for each test case above
4. Add the provided test scripts to each request

### Method 3: Run All Tests
1. Import the collection
2. Click on the collection name
3. Click **Run** to execute all test cases
4. View results in the Collection Runner

## Environment Setup

Create a Postman environment with these variables:
```json
{
  "baseUrl": "http://localhost:8182",
  "uniqueEmail": "",
  "testRunId": ""
}
```
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8182"
        }
    ],
    "event": [
        {
            "listen": "prerequest",
            "script": {
                "exec": [
                    "// Set base URL if not already set",
                    "if (!pm.environment.get(\"baseUrl\")) {",
                    "    pm.environment.set(\"baseUrl\", \"http://localhost:8182\");",
                    "}",
                    "",
                    "// Generate unique identifier for this test run",
                    "if (!pm.environment.get(\"testRunId\")) {",
                    "    pm.environment.set(\"testRunId\", Date.now());",
                    "}"
                ]
            }
        },
        {
            "listen": "test",
            "script": {
                "exec": [
                    "// Global tests that run after every request",
                    "pm.test(\"Response time is less than 2000ms\", function () {",
                    "    pm.expect(pm.response.responseTime).to.be.below(2000);",
                    "});",
                    "",
                    "pm.test(\"Response has valid JSON\", function () {",
                    "    try {",
                    "        pm.response.json();",
                    "    } catch (e) {",
                    "        pm.expect.fail(\"Response is not valid JSON\");",
                    "    }",
                    "});",
                    "",
                    "// Log response for debugging",
                    "console.log(\"Response:\", pm.response.json());"
                ]
            }
        }
    ],
    "item": [
        {
            "name": "1. Minimal Valid Registration",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"securePassword123\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is 201\", function () {",
                            "    pm.response.to.have.status(201);",
                            "});",
                            "",
                            "pm.test(\"Response has success message\", function () {",
                            "    const jsonData = pm.response.json();",
                            "    pm.expect(jsonData.message).to.equal(\"Registration successful\");",
                            "});",
                            "",
                            "pm.test(\"Response has user info\", function () {",
                            "    const jsonData = pm.response.json();",
                            "    pm.expect(jsonData.user).to.have.property('userId');",
                            "    pm.expect(jsonData.user).to.have.property('name');",
                            "    pm.expect(jsonData.user).to.have.property('email');",
                            "});",
                            "",
                            "pm.test(\"Response has JWT token\", function () {",
                            "    const jsonData = pm.response.json();",
                            "    pm.expect(jsonData.token).to.be.a('string');",
                            "    pm.expect(jsonData.token.length).to.be.greaterThan(50);",
                            "});"
                        ]
                    }
                }
            ]
        },
        {
            "name": "2. Registration with Selections",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Simple Test\",\n  \"email\": \"simple.test@example.com\",\n  \"password\": \"password123\",\n  \"targetCountries\": [1],\n  \"targetMajors\": [1],\n  \"researchInterests\": [1]\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "3. Full Registration with All Fields",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"John Doe Full\",\n  \"email\": \"john.doe.full@example.com\",\n  \"password\": \"securePassword123\",\n  \"gpa\": 3.75,\n  \"targetCountries\": [1, 2, 5],\n  \"targetMajors\": [1, 2, 6],\n  \"researchInterests\": [1, 2, 5, 14],\n  \"deadlineYear\": 2025\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "4. Registration with Test Scores",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Test Score User\",\n  \"email\": \"testscore@example.com\",\n  \"password\": \"password123\",\n  \"gpa\": 3.9,\n  \"testScores\": {\n    \"GRE\": \"325\",\n    \"IELTS\": \"8.5\",\n    \"TOEFL\": \"110\"\n  },\n  \"targetCountries\": [1, 5],\n  \"targetMajors\": [1, 2],\n  \"researchInterests\": [1, 7, 14],\n  \"deadlineYear\": 2026\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "5. Dynamic Email Generation",
            "event": [
                {
                    "listen": "prerequest",
                    "script": {
                        "exec": [
                            "// Generate unique email to avoid duplicates",
                            "const timestamp = Date.now();",
                            "const randomNum = Math.floor(Math.random() * 1000);",
                            "const uniqueEmail = `testuser${timestamp}${randomNum}@example.com`;",
                            "pm.environment.set(\"uniqueEmail\", uniqueEmail);"
                        ]
                    }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Dynamic User\",\n  \"email\": \"{{uniqueEmail}}\",\n  \"password\": \"password123\",\n  \"gpa\": 3.5\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "6. Invalid Email Format (400)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Invalid User\",\n  \"email\": \"invalid-email\",\n  \"password\": \"password123\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is 400\", function () {",
                            "    pm.response.to.have.status(400);",
                            "});",
                            "",
                            "pm.test(\"Error message for invalid email\", function () {",
                            "    const jsonData = pm.response.json();",
                            "    pm.expect(jsonData.message).to.include(\"Email format is invalid\");",
                            "});"
                        ]
                    }
                }
            ]
        },
        {
            "name": "7. Password Too Short (400)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Short Pass\",\n  \"email\": \"short@example.com\",\n  \"password\": \"123\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "8. Missing Required Fields (400)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"email\": \"missing@example.com\",\n  \"password\": \"password123\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "9. GPA Out of Range (400)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"High GPA\",\n  \"email\": \"highgpa@example.com\",\n  \"password\": \"password123\",\n  \"gpa\": 5.0\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "10. Invalid Year Range (400)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Future Year\",\n  \"email\": \"future@example.com\",\n  \"password\": \"password123\",\n  \"deadlineYear\": 2040\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "11. Duplicate Email (409)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Duplicate User\",\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"password123\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/v1/auth/register",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "v1", "auth", "register"]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is 400 for duplicate email\", function () {",
                            "    pm.response.to.have.status(400);",
                            "});",
                            "",
                            "pm.test(\"Error message for duplicate email\", function () {",
                            "    const jsonData = pm.response.json();",
                            "    pm.expect(jsonData.message).to.include(\"Email already exists\");",
                            "});"
                        ]
                    }
                }
            ]
        }
    ]
}
```

## Validation Rules Summary

### Required Fields
- `name`: 2-100 characters
- `email`: Valid email format with lowercase domain
- `password`: Minimum 6 characters

### Optional Fields
- `gpa`: 0.0-4.0 decimal
- `testScores`: Object with test score details
- `targetCountries`: Array of country IDs
- `targetMajors`: Array of major IDs  
- `researchInterests`: Array of research interest IDs
- `deadlineYear`: 2024-2030

### Notes
- All array fields accept multiple selections
- Test scores can include GRE, IELTS, TOEFL, etc.
- **IMPORTANT**: Test score field names are limited to 32 characters in database
- GPA is stored as BigDecimal for precision
- Email uniqueness is enforced at database level

### Database Schema Issues Identified
From the provided SQL schema, we can see:

1. **user_scores table structure in schema:**
   ```sql
   CREATE TABLE public.user_scores (
       id integer NOT NULL,
       score character varying(32) NOT NULL
   );
   ```

2. **Missing columns that the application expects:**
   - `test_name` column (which has the 32-char limit)
   - `user_id` foreign key column
   - User table missing: `name`, `email`, `password`, `gpa`, `deadline_year`

3. **Schema vs Application Mismatch:**
   - The provided schema appears to be a partial/old version
   - The Spring Boot application expects a different table structure
   - Hibernate is likely creating missing columns via `spring.jpa.hibernate.ddl-auto=update`

### Working Test Cases Based on Current Setup

#### **Test Case 1: Minimal Registration (CONFIRMED WORKING)**
```json
{
  "name": "Test User",
  "email": "testuser123@example.com",
  "password": "password123"
}
```
**Response:** ✅ Returns JWT token and user ID

#### **Test Case 2: Registration with Limited Test Scores (Use Short Names)**
```json
{
  "name": "John Doe",
  "email": "john.doe.new@example.com",
  "password": "securePassword123",
  "gpa": 3.75,
  "testScores": {
    "GRE_V": 160,
    "GRE_Q": 165,
    "GRE_W": 4.5,
    "IELTS": 7.5
  },
  "targetCountries": [1, 2],
  "targetMajors": [1, 2],
  "researchInterests": [1, 2, 3],
  "deadlineYear": 2025
}
```

### Database Limitations Discovered
- `test_name` field in `user_scores` table has varchar(32) limit
- Use very short field names: "GRE_V", "GRE_Q", "GRE_W", "IELTS" etc.
- Avoid nested objects in testScores - use flat key-value pairs
