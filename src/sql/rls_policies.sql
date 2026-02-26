-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Events (authenticated users only)
CREATE POLICY "Authenticated users can view events" 
  ON events FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert events" 
  ON events FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update events" 
  ON events FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete events" 
  ON events FOR DELETE 
  USING (auth.role() = 'authenticated');

-- RLS Policies for Event Venues (authenticated users only)
CREATE POLICY "Authenticated users can view event venues" 
  ON event_venues FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert event venues" 
  ON event_venues FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event venues" 
  ON event_venues FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event venues" 
  ON event_venues FOR DELETE 
  USING (auth.role() = 'authenticated');

-- RLS Policies for Event Dates (authenticated users only)
CREATE POLICY "Authenticated users can view event dates" 
  ON event_dates FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert event dates" 
  ON event_dates FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event dates" 
  ON event_dates FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event dates" 
  ON event_dates FOR DELETE 
  USING (auth.role() = 'authenticated');
