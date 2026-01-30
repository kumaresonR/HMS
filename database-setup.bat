@echo off
REM =====================================================
REM HMS Database Setup Script for Windows
REM =====================================================
REM This script creates the database and schemas for local development
REM
REM Prerequisites:
REM 1. PostgreSQL must be installed
REM 2. psql must be in your PATH
REM 3. Default password: Test@123 (or update the script)
REM =====================================================

echo =====================================================
echo HMS Database Setup for Local Development
echo =====================================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL psql command not found!
    echo Please ensure PostgreSQL is installed and added to PATH
    pause
    exit /b 1
)

echo Step 1: Creating database and schemas...
echo.

REM Set PostgreSQL password (update if different)
set PGPASSWORD=Test@123

REM Run the SQL script
psql -U postgres -f database-setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================
    echo Database setup completed successfully!
    echo =====================================================
    echo.
    echo Database: myappdb
    echo Username: postgres
    echo Password: Test@123
    echo.
    echo All schemas have been created.
    echo You can now start the HMS services.
    echo.
) else (
    echo.
    echo =====================================================
    echo ERROR: Database setup failed!
    echo =====================================================
    echo.
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. Password is correct (currently: Test@123)
    echo 3. You have superuser privileges
    echo.
)

pause

