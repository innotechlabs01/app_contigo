-- Companion profiles and request expiry
ALTER TABLE service_requests ADD COLUMN expires_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS companion_profiles (
    companion_id TEXT PRIMARY KEY,
    rating REAL NOT NULL DEFAULT 5.0,
    experience_years INTEGER NOT NULL DEFAULT 0,
    languages TEXT NOT NULL DEFAULT '[]',
    services TEXT NOT NULL DEFAULT '[]',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (companion_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed roles (client, companion)
INSERT INTO roles (id, name, description) VALUES
    ('role_client', 'client', 'Cliente que solicita acompañamiento'),
    ('role_companion', 'companion', 'Acompañante que presta el servicio')
ON CONFLICT(id) DO NOTHING;
