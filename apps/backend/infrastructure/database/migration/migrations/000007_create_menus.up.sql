CREATE TABLE IF NOT EXISTS menus (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT,
    route TEXT,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0,
    permission TEXT,
    role TEXT,
    badge TEXT,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL
);

CREATE INDEX idx_menus_parent_id ON menus(parent_id);
CREATE INDEX idx_menus_sort_order ON menus(sort_order);
