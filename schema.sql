-- ====================================================================
-- AssetFlow Database Schema
-- Enterprise Asset & Resource Management System
-- Character Set: UTF8MB4, Engine: InnoDB
-- Focus: Logistics, tracking, maintenance, and audits (no financial tables)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `assetflow_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `assetflow_db`;

-- Disable foreign key checks to allow drops and clean creation
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_records`;
DROP TABLE IF EXISTS `audit_cycles`;
DROP TABLE IF EXISTS `maintenance_requests`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `allocations`;
DROP TABLE IF EXISTS `assets`;
DROP TABLE IF EXISTS `asset_categories`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `departments`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. DEPARTMENTS TABLE (Created first, head_id FK added later to avoid circular dependency issues)
CREATE TABLE `departments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `head_id` INT NULL,
    `parent_id` INT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`parent_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_departments_parent` ON `departments` (`parent_id`);
CREATE INDEX `idx_departments_status` ON `departments` (`status`);

-- 2. USERS TABLE (Employee Directory)
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `employee_id` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(50) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('Admin', 'Asset Manager', 'Department Head', 'Employee') NOT NULL DEFAULT 'Employee',
    `department_id` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_users_role` ON `users` (`role`);
CREATE INDEX `idx_users_department` ON `users` (`department_id`);

-- Add foreign key constraint to departments pointing to users
ALTER TABLE `departments` 
ADD CONSTRAINT `fk_departments_head` 
FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

CREATE INDEX `idx_departments_head` ON `departments` (`head_id`);

-- 3. ASSET CATEGORIES TABLE
CREATE TABLE `asset_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ASSETS TABLE
CREATE TABLE `assets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `asset_tag` VARCHAR(100) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `category_id` INT NOT NULL,
    `serial_number` VARCHAR(100) NULL,
    `status` ENUM('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed') NOT NULL DEFAULT 'Available',
    `condition_notes` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `is_bookable` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_assets_category` ON `assets` (`category_id`);
CREATE INDEX `idx_assets_status` ON `assets` (`status`);
CREATE INDEX `idx_assets_location` ON `assets` (`location`);

-- 5. ALLOCATIONS TABLE (Transfers/Assignments)
CREATE TABLE `allocations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `asset_id` INT NOT NULL,
    `assigned_to` INT NOT NULL,
    `assigned_by` INT NOT NULL,
    `expected_return_date` DATE NULL,
    `actual_return_date` DATE NULL,
    `status` ENUM('Active', 'Returned', 'Overdue') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_allocations_asset` ON `allocations` (`asset_id`);
CREATE INDEX `idx_allocations_assigned_to` ON `allocations` (`assigned_to`);
CREATE INDEX `idx_allocations_status` ON `allocations` (`status`);

-- 6. BOOKINGS TABLE (Shared Resources)
CREATE TABLE `bookings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `asset_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_bookings_asset` ON `bookings` (`asset_id`);
CREATE INDEX `idx_bookings_user` ON `bookings` (`user_id`);
CREATE INDEX `idx_bookings_status` ON `bookings` (`status`);
CREATE INDEX `idx_bookings_time` ON `bookings` (`start_time`, `end_time`);

-- 7. MAINTENANCE REQUESTS TABLE
CREATE TABLE `maintenance_requests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `asset_id` INT NOT NULL,
    `requested_by` INT NOT NULL,
    `description` TEXT NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
    `status` ENUM('Pending', 'Approved', 'Rejected', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Pending',
    `technician_assigned` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`technician_assigned`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_maintenance_asset` ON `maintenance_requests` (`asset_id`);
CREATE INDEX `idx_maintenance_requested` ON `maintenance_requests` (`requested_by`);
CREATE INDEX `idx_maintenance_status` ON `maintenance_requests` (`status`);
CREATE INDEX `idx_maintenance_priority` ON `maintenance_requests` (`priority`);

-- 8. AUDIT CYCLES TABLE
CREATE TABLE `audit_cycles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` ENUM('Draft', 'Active', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_audit_cycles_status` ON `audit_cycles` (`status`);

-- 9. AUDIT RECORDS TABLE
CREATE TABLE `audit_records` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `audit_cycle_id` INT NOT NULL,
    `asset_id` INT NOT NULL,
    `auditor_id` INT NOT NULL,
    `status` ENUM('Verified', 'Missing', 'Damaged') NOT NULL DEFAULT 'Verified',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`audit_cycle_id`) REFERENCES `audit_cycles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`auditor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX `idx_audit_records_cycle` ON `audit_records` (`audit_cycle_id`);
CREATE INDEX `idx_audit_records_asset` ON `audit_records` (`asset_id`);
CREATE INDEX `idx_audit_records_auditor` ON `audit_records` (`auditor_id`);
CREATE INDEX `idx_audit_records_status` ON `audit_records` (`status`);
