-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT DEFAULT 'Remote',
    type TEXT DEFAULT 'Full-time',
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio_url TEXT,
    resume_url TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Simplified for now, similar to waitlist)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Public can read active jobs
CREATE POLICY "Public can read active jobs" ON jobs
    FOR SELECT USING (is_active = true);

-- Public can insert applications
CREATE POLICY "Public can insert applications" ON job_applications
    FOR INSERT WITH CHECK (true);

-- Admin can manage everything (assuming they have admin roles set up in Supabase)
-- (Existing system uses custom roles, so we should follow that pattern)
