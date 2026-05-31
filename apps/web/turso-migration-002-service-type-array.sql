-- Migration: Allow multiple service types (store as JSON array)
-- Turso/SQLite migration for service_type column change

-- SQLite doesn't support ALTER TABLE DROP CONSTRAINT,
-- so we recreate the table with the updated schema.

-- Rename old table
ALTER TABLE requests RENAME TO requests_old;

-- Create new table with service_type as TEXT (JSON array, no CHECK constraint)
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  id_number TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT '[]',
  evaluation TEXT,
  evaluation_score INTEGER,
  evaluation_passed INTEGER,
  cv_url TEXT,
  cv_file_name TEXT,
  presentation_video_url TEXT,
  presentation_video_name TEXT,
  reference_video_url TEXT,
  reference_video_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  application_date TEXT DEFAULT (datetime('now', 'utc')),
  review_date TEXT,
  experience TEXT,
  message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Copy existing data, wrapping single service_type in a JSON array
INSERT INTO requests (
  id, first_name, last_name, id_number, email, phone, location, service_type,
  evaluation, evaluation_score, evaluation_passed,
  cv_url, cv_file_name,
  presentation_video_url, presentation_video_name,
  reference_video_url, reference_video_name,
  status, application_date, review_date, experience, message,
  created_at, updated_at
)
SELECT
  id, first_name, last_name, id_number, email, phone, location,
  CASE WHEN service_type IS NOT NULL AND service_type != ''
    THEN '["' || service_type || '"]'
    ELSE '[]'
  END,
  evaluation, evaluation_score, evaluation_passed,
  cv_url, cv_file_name,
  presentation_video_url, presentation_video_name,
  reference_video_url, reference_video_name,
  status, application_date, review_date, experience, message,
  created_at, updated_at
FROM requests_old;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_date ON requests(application_date DESC);

-- Drop old table
DROP TABLE IF EXISTS requests_old;
