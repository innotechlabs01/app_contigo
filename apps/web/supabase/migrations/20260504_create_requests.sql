-- Create requests table for onboarding applications
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Personal information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  id_number VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  location VARCHAR(200) NOT NULL,
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('Acompañamiento', 'Cuidado', 'Apoyo')),
  
  -- Evaluation data
  evaluation JSONB,
  evaluation_score INTEGER,
  evaluation_passed BOOLEAN,
  
  -- Documents (stored as URLs or file paths)
  cv_url TEXT,
  cv_file_name VARCHAR(255),
  presentation_video_url TEXT,
  presentation_video_name VARCHAR(255),
  reference_video_url TEXT,
  reference_video_name VARCHAR(255),
  
  -- Status and metadata
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_date TIMESTAMP WITH TIME ZONE,
  
  -- Additional info
  experience TEXT,
  message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_date ON requests(application_date DESC);

-- Enable Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust later for production)
CREATE POLICY "Allow all operations" ON requests FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
