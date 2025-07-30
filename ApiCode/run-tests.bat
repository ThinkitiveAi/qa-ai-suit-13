@echo off
echo.
echo ===============================================
echo Healthcare API Testing Framework - Quick Run
echo ===============================================
echo.

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Running Healthcare API Tests...
echo.
call npm test

echo.
echo Test execution completed!
echo Check playwright-report folder for detailed results.
echo.
pause
