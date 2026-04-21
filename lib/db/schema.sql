-- Events aggregation table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(255) UNIQUE NOT NULL,
  venue_id VARCHAR(255) NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  event_title VARCHAR(500) NOT NULL,
  event_description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  calendar_id VARCHAR(255),
  event_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  raw_data JSONB
);

-- Event sections table (one-to-many from events)
CREATE TABLE IF NOT EXISTS event_sections (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL,
  section_title VARCHAR(500) NOT NULL,
  section_description TEXT,
  section_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Pricing tiers table (one-to-many from event_sections)
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL,
  tier_name VARCHAR(255) NOT NULL,
  price INT,
  capacity INT,
  sold_out BOOLEAN DEFAULT FALSE,
  tier_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES event_sections(id) ON DELETE CASCADE
);

ALTER TABLE IF EXISTS pricing_tiers
  ALTER COLUMN price DROP NOT NULL;

ALTER TABLE IF EXISTS pricing_tiers
  ALTER COLUMN capacity DROP NOT NULL;

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_venue_start ON events(venue_id, start_time);
CREATE INDEX IF NOT EXISTS idx_event_sections_event_id ON event_sections(event_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_section_id ON pricing_tiers(section_id);

-- Sync tracking table
CREATE TABLE IF NOT EXISTS sync_status (
  id SERIAL PRIMARY KEY,
  venue_id VARCHAR(255) UNIQUE NOT NULL,
  last_sync TIMESTAMP,
  last_sync_status VARCHAR(50),
  sync_count INT DEFAULT 0,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_status_venue ON sync_status(venue_id);
