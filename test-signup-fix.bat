@echo off
echo === GradPilot Signup Test ===
echo Testing all endpoints to ensure signup functionality works...
echo.

echo 1. Testing Backend Endpoints Directly:
echo   Research Interests:
curl -s http://localhost:8182/api/research-interests >nul && echo   Working (Backend endpoint responding) || echo   Failed
echo.

echo   Majors:
curl -s http://localhost:8182/api/majors >nul && echo   Working (Backend endpoint responding) || echo   Failed
echo.

echo   Countries:
curl -s http://localhost:8182/api/countries >nul && echo   Working (Backend endpoint responding) || echo   Failed
echo.

echo 2. Testing Frontend API Routes:
echo   Frontend Research Interests:
curl -s http://localhost:3000/api/research-interests >nul && echo   Working (Frontend proxy responding) || echo   Failed
echo.

echo   Frontend Majors:
curl -s http://localhost:3000/api/majors >nul && echo   Working (Frontend proxy responding) || echo   Failed
echo.

echo   Frontend Countries:
curl -s http://localhost:3000/api/countries >nul && echo   Working (Frontend proxy responding) || echo   Failed
echo.

echo 3. Testing Registration:
set TIMESTAMP=%random%
set EMAIL=test%TIMESTAMP%@example.com
echo   Registering new user with email: %EMAIL%

curl -X POST http://localhost:8182/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User %TIMESTAMP%\",\"email\":\"%EMAIL%\",\"password\":\"password123\",\"gpa\":3.5,\"targetCountries\":[1],\"targetMajors\":[1],\"researchInterests\":[1]}" ^
  -s > temp_response.txt

findstr "Registration successful" temp_response.txt >nul && (
    echo   ✓ Registration successful!
) || (
    echo   X Registration failed!
    echo   Response:
    type temp_response.txt
)

del temp_response.txt >nul 2>&1

echo.
echo 4. Access Points:
echo   Frontend: http://localhost:3000/signup
echo   Backend API: http://localhost:8182/api/v1/auth/register
echo.
echo Test completed!
pause
