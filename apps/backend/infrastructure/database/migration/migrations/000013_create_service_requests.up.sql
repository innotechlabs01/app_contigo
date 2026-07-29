CREATE TABLE IF NOT EXISTS service_requests (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    companion_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    meeting_point TEXT,
    preferred_date TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (companion_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_service_requests_client_id ON service_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_companion_id ON service_requests(companion_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
