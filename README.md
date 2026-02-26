============================================================
1. PROJECT IDENTITY & CLASSIFICATION
============================================================
job_id              : Unique Identifier (e.g., AV-2026-001)
event_name          : Full Title of the Event
client_name         :
client_type         : [direct, indirect]
sub_client_name     : if any
job_status          : [Inquiry, Quoted, Confirmed, In-Prep, On-Site, Strike, Completed, Archived]
event_type          : [SI, RSI, AV, Broadcast, ]
project_manager_id  : FK to Profiles (The PM in charge)

============================================================
2. CRITICAL TIMELINE (High-End Granularity)
============================================================
event_dates         : When starts and ends [single day or multi?]
load_in_time        : When the trucks arrive at the dock
setup_start         : When technical build begins [after load in ?]
rehearsal_start     : When talent/speakers are on stage (Quiet time)
strike_start        : When packing and teardown/dismantle begins
load_out_deadline   : When the hall must be empty (To avoid venue fines)
warehouse_return    : When gear is expected back in inventory

============================================================
3. VENUE & LOGISTICS
============================================================
venue_name          : Name of Hotel/Convention Center
hall_name           : Specific Room or Ballroom (e.g., Salon A)
venue_address       : Full physical address for Google Maps integration
loading_dock_notes  : Dock height, ramp access, street-load restrictions
safety_precautions  : Boot, vest, helmet [required or not ?]
freight_elevator    : Dimensions (W x H x D) and Weight Capacity
power_specs         : [3-Phase 200A, 100A, or Standard Wall Outlets]
power_drop_location : Where is the tie-in? (Stage left, Back of house) [provided or ?]
parking_passes      : Number of truck/crew spots allocated
security_access     : Badge requirements or security clearance levels

============================================================
4. PERSONNEL & CONTACTS (Multiple POCs)
============================================================
* Note: This should be a related table "job_contacts"
contact_name        : Full Name
contact_role        : [Client Lead, Venue Manager, Technical Director, Caterer]
contact_mobile      : Phone number (with click-to-call)
contact_email       : Email address
is_on_site          : Boolean (Are they physically at the event?)

============================================================
7. ATTACHMENTS (Supabase Storage Links)
============================================================
file_floor_plan     : Link to CAD/PDF/IMG of the room layout
file_run_of_show    : Link to the minute-by-minute schedule/AGENDA (Excel/CSV/pdf/img)
