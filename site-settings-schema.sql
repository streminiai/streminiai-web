-- Create site_settings table
create table if not exists public.site_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Policy: Allow public read access
create policy "Allow public read access" on public.site_settings
  for select
  using (true);

-- Policy: Allow authenticated users to manage settings
create policy "Allow authenticated manage" on public.site_settings
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Insert initial survey data
insert into public.site_settings (key, value)
values (
  'survey_stats',
  '{
    "averageRating": 3.91,
    "totalResponses": 35,
    "ratings": [
      { "stars": 5, "count": 10, "percentage": 28.6 },
      { "stars": 4, "count": 12, "percentage": 34.3 },
      { "stars": 3, "count": 13, "percentage": 37.1 },
      { "stars": 2, "count": 0, "percentage": 0 },
      { "stars": 1, "count": 0, "percentage": 0 }
    ],
    "dailyUseIntent": { "yes": 75, "no": 0, "maybe": 25 },
    "onScreenAccessComfort": { "yes": 87.5, "no": 0, "maybe": 12.5 },
    "topFeedback": [
      "Floating features",
      "Reminders and to do list",
      "It working as a digital bodyguard",
      "The on screen chatbot and AI keyboard",
      "Voice control",
      "Automation of tasks such as sending messages or checking emails"
    ]
  }'::jsonb
)
on conflict (key) do nothing;
