
-- First, let's ensure the profiles table has the correct structure and trigger
-- Drop and recreate the trigger to ensure it works properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, profile_image)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Unknown User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'profileImage'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create competition_rooms table for the room functionality
CREATE TABLE IF NOT EXISTS public.competition_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  max_participants INTEGER DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room_participants table to track who's in each room
CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.competition_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable RLS for both tables
ALTER TABLE public.competition_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- Policies for competition_rooms
CREATE POLICY "Users can view all active rooms" 
  ON public.competition_rooms 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can create rooms" 
  ON public.competition_rooms 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" 
  ON public.competition_rooms 
  FOR UPDATE 
  USING (auth.uid() = created_by);

-- Policies for room_participants
CREATE POLICY "Users can view room participants" 
  ON public.room_participants 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can join rooms" 
  ON public.room_participants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" 
  ON public.room_participants 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE OR REPLACE TRIGGER handle_rooms_updated_at 
  BEFORE UPDATE ON public.competition_rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate unique room keys
CREATE OR REPLACE FUNCTION public.generate_room_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  key TEXT;
  key_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a 6-character alphanumeric key
    key := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if key already exists
    SELECT EXISTS(SELECT 1 FROM public.competition_rooms WHERE room_key = key) INTO key_exists;
    
    -- Exit loop if key is unique
    IF NOT key_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN key;
END;
$$;
