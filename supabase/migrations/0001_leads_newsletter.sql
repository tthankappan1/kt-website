-- kalyanithilak.com — leads + newsletter capture (README §7, schema locked).
-- Keep this schema clean and boring: a lightweight CRM will be built on top later.

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intent text not null check (intent in ('selling','buying','both','curious')),
  timeframe text,
  first_name text not null,
  email text not null,
  message text,
  newsletter_alameda boolean not null default false,
  newsletter_contracosta boolean not null default false,
  source_page text
);

create table newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source_page text
);
create unique index newsletter_signups_email_idx on newsletter_signups (lower(email));

-- RLS enabled with NO anon policies: the only write path is the server
-- route handlers using the service-role key (which bypasses RLS).
alter table leads enable row level security;
alter table newsletter_signups enable row level security;
