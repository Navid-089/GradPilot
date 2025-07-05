@echo off

REM Define the base directory for the new service
set SERVICE_DIR=services\sop-review-service
set BASE_PACKAGE_PATH=src\main\java\com\gradpilot\sopreview

REM Create the main service directory
echo Creating service directory: %SERVICE_DIR%
mkdir "%SERVICE_DIR%"

REM Create the nested package structure
echo Creating package structure...
mkdir "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\controller"
mkdir "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\dto"
mkdir "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\service"

REM Create the resources directory
mkdir "%SERVICE_DIR%\src\main\resources"

REM Create the files using 'type nul >' which creates an empty file
echo Creating files...
type nul > "%SERVICE_DIR%\pom.xml"
type nul > "%SERVICE_DIR%\Dockerfile"
type nul > "%SERVICE_DIR%\src\main\resources\application.properties"
type nul > "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\SopReviewApplication.java"
type nul > "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\controller\SopReviewController.java"
type nul > "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\dto\ReviewRequest.java"
type nul > "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\dto\ReviewResponse.java"
type nul > "%SERVICE_DIR%\%BASE_PACKAGE_PATH%\service\SopReviewService.java"

echo.
echo ✅ Done. The file and folder structure for '%SERVICE_DIR%' has been created.
pause