ALTER TABLE service_requests DROP COLUMN expires_at;
DROP TABLE IF EXISTS companion_profiles;
DELETE FROM roles WHERE id IN ('role_client', 'role_companion');
