@echo off
setlocal enabledelayedexpansion

echo 🚀 GradPilot Signup API Test Runner
echo =====================================
echo.

REM Base URL
set BASE_URL=http://localhost:8182/api/v1/auth/register

REM Test counter
set PASS=0
set FAIL=0

REM Generate unique timestamp
for /f %%i in ('powershell -command "Get-Date -UFormat %%s"') do set TIMESTAMP=%%i
set UNIQUE_EMAIL=testuser%TIMESTAMP%@example.com

echo 🧪 Running test cases...
echo.

REM Test 1: Valid minimal registration
echo Testing: 1. Minimal Valid Registration
curl -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"%UNIQUE_EMAIL%\",\"password\":\"password123\"}" %BASE_URL% > temp1.txt
findstr "Registration successful" temp1.txt >nul && (
    echo   ✅ PASS - Valid registration
    set /a PASS+=1
) || (
    echo   ❌ FAIL - Valid registration
    set /a FAIL+=1
)
echo.

REM Test 2: Invalid email format
echo Testing: 2. Invalid Email Format
curl -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"Invalid User\",\"email\":\"invalid-email\",\"password\":\"password123\"}" %BASE_URL% > temp2.txt
findstr "Email format" temp2.txt >nul && (
    echo   ✅ PASS - Invalid email caught
    set /a PASS+=1
) || (
    echo   ❌ FAIL - Invalid email not caught
    set /a FAIL+=1
)
echo.

REM Test 3: Password too short
echo Testing: 3. Password Too Short
curl -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"Short Pass\",\"email\":\"short%TIMESTAMP%@example.com\",\"password\":\"123\"}" %BASE_URL% > temp3.txt
findstr "6 characters" temp3.txt >nul && (
    echo   ✅ PASS - Short password caught
    set /a PASS+=1
) || (
    echo   ❌ FAIL - Short password not caught
    set /a FAIL+=1
)
echo.

REM Test 4: Missing required field
echo Testing: 4. Missing Name Field
curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"missing%TIMESTAMP%@example.com\",\"password\":\"password123\"}" %BASE_URL% > temp4.txt
findstr "Name is required" temp4.txt >nul && (
    echo   ✅ PASS - Missing name caught
    set /a PASS+=1
) || (
    echo   ❌ FAIL - Missing name not caught
    set /a FAIL+=1
)
echo.

REM Test 5: GPA out of range
echo Testing: 5. GPA Out of Range
curl -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"High GPA\",\"email\":\"highgpa%TIMESTAMP%@example.com\",\"password\":\"password123\",\"gpa\":5.0}" %BASE_URL% > temp5.txt
findstr "4.0" temp5.txt >nul && (
    echo   ✅ PASS - High GPA caught
    set /a PASS+=1
) || (
    echo   ❌ FAIL - High GPA not caught
    set /a FAIL+=1
)
echo.

REM Test 6: Valid registration with all fields
echo Testing: 6. Full Registration
set FULL_EMAIL=full%TIMESTAMP%@example.com
curl -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"Full User\",\"email\":\"%FULL_EMAIL%\",\"password\":\"password123\",\"gpa\":3.75,\"targetCountries\":[1,2],\"targetMajors\":[1,2],\"researchInterests\":[1,2],\"deadlineYear\":2025}" %BASE_URL% > temp6.txt
findstr "Registration successful" temp6.txt >nul && (
    echo   ✅ PASS - Full registration
    set /a PASS+=1
) || (
    echo   ❌ FAIL - Full registration
    set /a FAIL+=1
)
echo.

REM Test 7: Duplicate email
echo Testing: 7. Duplicate Email
curl -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"Duplicate User\",\"email\":\"%UNIQUE_EMAIL%\",\"password\":\"password123\"}" %BASE_URL% > temp7.txt
findstr "already exists" temp7.txt >nul && (
    echo   ✅ PASS - Duplicate email caught
    set /a PASS+=1
) || (
    echo   ❌ FAIL - Duplicate email not caught
    set /a FAIL+=1
)
echo.

REM Clean up temp files
del temp*.txt >nul 2>&1

REM Summary
echo 📊 Test Results Summary
echo =======================
echo ✅ Passed: %PASS%
echo ❌ Failed: %FAIL%
set /a TOTAL=%PASS%+%FAIL%
echo 📝 Total:  %TOTAL%
echo.

if %FAIL% EQU 0 (
    echo 🎉 All tests passed!
) else (
    echo 💥 Some tests failed!
)

pause
