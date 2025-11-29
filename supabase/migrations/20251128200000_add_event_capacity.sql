-- Add capacity column to events table
-- NULL = unlimited capacity, integer = max number of "yes" RSVPs allowed
ALTER TABLE "public"."events"
ADD COLUMN "capacity" integer DEFAULT NULL;

-- Ensure capacity is positive if set
ALTER TABLE "public"."events"
ADD CONSTRAINT "events_capacity_positive"
CHECK (capacity IS NULL OR capacity > 0);
