@echo off
echo Testing GradPilot Backend Endpoints...
echo.

echo Testing Research Interests endpoint:
curl -X GET http://localhost:8182/api/research-interests
echo.
echo.

echo Testing Majors endpoint:
curl -X GET http://localhost:8182/api/majors  
echo.
echo.

echo Testing Countries endpoint:
curl -X GET http://localhost:8182/api/countries
echo.
echo.

echo Testing Registration with minimal data:
curl -X POST http://localhost:8182/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

pause
