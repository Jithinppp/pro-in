-- Events Table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Information
  job_id TEXT,
  event_name TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  client_type TEXT NOT NULL CHECK (client_type IN ('direct', 'indirect')),
  event_type TEXT NOT NULL CHECK (event_type IN ('SI', 'RSI', 'AV', 'Broadcast')),
  project_manager_id TEXT NOT NULL,
  
  -- Time and Dates
  setup_date TIMESTAMP WITH TIME ZONE,
  event_date DATE,
  is_multiple_days BOOLEAN DEFAULT FALSE,
  
  -- Contact Details
  contact_name TEXT NOT NULL,
  contact_role TEXT NOT NULL,
  contact_mobile TEXT NOT NULL,
  contact_email TEXT,
  is_on_site BOOLEAN DEFAULT FALSE,
  
  -- Attachments
  file_floor_plan TEXT,
  file_run_of_show TEXT,
  
  -- Status
  job_status TEXT DEFAULT 'pending' CHECK (job_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  
  -- User reference (from auth)
  user_id UUID REFERENCES auth.users(id),
  
  -- Row level security
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Event Venues Table (for multiple venues)
CREATE TABLE event_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Event reference
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  venue_order INTEGER DEFAULT 1,
  
  -- Venue Details
  venue_name TEXT NOT NULL,
  hall_name TEXT,
  venue_address TEXT,
  pax INTEGER,
  loading_dock_notes TEXT,
  safety_precautions TEXT CHECK (safety_precautions IN ('yes', 'no')),
  parking_passes TEXT CHECK (parking_passes IN ('available', 'not_available')),
  security_access TEXT
);

-- Enable RLS
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

-- Event Additional Dates Table (for multi-day events)
CREATE TABLE event_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Event reference
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  date_order INTEGER DEFAULT 1,
  
  -- Date Details
  event_date DATE NOT NULL,
  notes TEXT
);

-- Enable RLS
ALTER TABLE event_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Events
CREATE POLICY "Users can view their own events" 
  ON events FOR SELECT 
  USING (user_id = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Users can insert their own events" 
  ON events FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" 
  ON events FOR UPDATE 
  USING (user_id = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Users can delete their own events" 
  ON events FOR DELETE 
  USING (user_id = auth.uid() OR created_by = auth.uid());

-- RLS Policies for Event Venues
CREATE POLICY "Users can view event venues" 
  ON event_venues FOR SELECT 
  USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "Users can insert event venues" 
  ON event_venues FOR INSERT 
  WITH CHECK (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "Users can update event venues" 
  ON event_venues FOR UPDATE 
  USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "Users can delete event venues" 
  ON event_venues FOR DELETE 
  USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

-- RLS Policies for Event Dates
CREATE POLICY "Users can view event dates" 
  ON event_dates FOR SELECT 
  USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "Users can insert event dates" 
  ON event_dates FOR INSERT 
  WITH CHECK (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "Users can update event dates" 
  ON event_dates FOR UPDATE 
  USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

CREATE POLICY "Users can delete event dates" 
  ON event_dates FOR DELETE 
  USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid() OR created_by = auth.uid())
  );

-- Create indexes for better performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_venues_event_id ON event_venues(event_id);
CREATE INDEX idx_event_dates_event_id ON event_dates(event_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
