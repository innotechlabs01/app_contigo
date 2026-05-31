-- Migration 003: Add rejection_reason column to requests table
ALTER TABLE requests ADD COLUMN rejection_reason TEXT;
