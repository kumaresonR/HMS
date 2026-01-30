-- =====================================================
-- HMS Database Setup Script for Local Development
-- =====================================================
-- This script creates the database and all required schemas
-- for the HMS microservices architecture
--
-- Prerequisites:
-- 1. PostgreSQL must be installed and running
-- 2. You must have superuser access (postgres user)
-- 3. Run this script as: psql -U postgres -f database-setup.sql
-- =====================================================

-- Create the main database
CREATE DATABASE myappdb
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the database
\c myappdb

-- Create schemas for each microservice
-- Each service uses its own schema for data isolation

-- Login Management Service
CREATE SCHEMA IF NOT EXISTS login;
GRANT ALL PRIVILEGES ON SCHEMA login TO postgres;
GRANT USAGE ON SCHEMA login TO postgres;

-- Patient Management Service
CREATE SCHEMA IF NOT EXISTS patient;
GRANT ALL PRIVILEGES ON SCHEMA patient TO postgres;
GRANT USAGE ON SCHEMA patient TO postgres;

-- OPD (Outpatient Department) Management Service
CREATE SCHEMA IF NOT EXISTS opd;
GRANT ALL PRIVILEGES ON SCHEMA opd TO postgres;
GRANT USAGE ON SCHEMA opd TO postgres;

-- IPD (Inpatient Department) Management Service
CREATE SCHEMA IF NOT EXISTS ipd;
GRANT ALL PRIVILEGES ON SCHEMA ipd TO postgres;
GRANT USAGE ON SCHEMA ipd TO postgres;

-- Billing Management Service
CREATE SCHEMA IF NOT EXISTS billing;
GRANT ALL PRIVILEGES ON SCHEMA billing TO postgres;
GRANT USAGE ON SCHEMA billing TO postgres;

-- Admin Management Service (uses default schema or public)
-- No explicit schema needed, but creating for consistency
CREATE SCHEMA IF NOT EXISTS admin;
GRANT ALL PRIVILEGES ON SCHEMA admin TO postgres;
GRANT USAGE ON SCHEMA admin TO postgres;

-- Additional service schemas (add more as needed based on your services)
CREATE SCHEMA IF NOT EXISTS ambulance;
GRANT ALL PRIVILEGES ON SCHEMA ambulance TO postgres;
GRANT USAGE ON SCHEMA ambulance TO postgres;

CREATE SCHEMA IF NOT EXISTS bloodbank;
GRANT ALL PRIVILEGES ON SCHEMA bloodbank TO postgres;
GRANT USAGE ON SCHEMA bloodbank TO postgres;

CREATE SCHEMA IF NOT EXISTS laboratory;
GRANT ALL PRIVILEGES ON SCHEMA laboratory TO postgres;
GRANT USAGE ON SCHEMA laboratory TO postgres;

CREATE SCHEMA IF NOT EXISTS inventory;
GRANT ALL PRIVILEGES ON SCHEMA inventory TO postgres;
GRANT USAGE ON SCHEMA inventory TO postgres;

CREATE SCHEMA IF NOT EXISTS finance;
GRANT ALL PRIVILEGES ON SCHEMA finance TO postgres;
GRANT USAGE ON SCHEMA finance TO postgres;

CREATE SCHEMA IF NOT EXISTS frontoffice;
GRANT ALL PRIVILEGES ON SCHEMA frontoffice TO postgres;
GRANT USAGE ON SCHEMA frontoffice TO postgres;

CREATE SCHEMA IF NOT EXISTS ot;
GRANT ALL PRIVILEGES ON SCHEMA ot TO postgres;
GRANT USAGE ON SCHEMA ot TO postgres;

CREATE SCHEMA IF NOT EXISTS tpa;
GRANT ALL PRIVILEGES ON SCHEMA tpa TO postgres;
GRANT USAGE ON SCHEMA tpa TO postgres;

CREATE SCHEMA IF NOT EXISTS notification;
GRANT ALL PRIVILEGES ON SCHEMA notification TO postgres;
GRANT USAGE ON SCHEMA notification TO postgres;

CREATE SCHEMA IF NOT EXISTS dashboard;
GRANT ALL PRIVILEGES ON SCHEMA dashboard TO postgres;
GRANT USAGE ON SCHEMA dashboard TO postgres;

CREATE SCHEMA IF NOT EXISTS birthdeath;
GRANT ALL PRIVILEGES ON SCHEMA birthdeath TO postgres;
GRANT USAGE ON SCHEMA birthdeath TO postgres;

-- Verify schemas were created
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schema_name;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Database: myappdb';
    RAISE NOTICE 'Default credentials: postgres / Test@123';
    RAISE NOTICE '========================================';
END $$;

