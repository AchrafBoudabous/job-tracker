create extension if not exists "uuid-ossp";


create table jobs (
  id                       uuid primary key default uuid_generate_v4(),
  company                  text not null,
  role                     text not null,
  location                 text,
  job_url                  text,
  job_description_snapshot text,
  status                   text not null default 'saved'
                             check (status in ('saved','applied','interview','offer','rejected','withdrawn')),
  applied_date             date,
  follow_up_date           date,
  salary_range             text,
  source                   text,
  notes                    text,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);


create table application_packages (
  id               uuid primary key default uuid_generate_v4(),
  job_id           uuid references jobs(id) on delete cascade,
  cv_version_label text,
  cv_file_url      text,
  cover_letter     text,
  created_at       timestamptz default now()
);

create table interview_rounds (
  id             uuid primary key default uuid_generate_v4(),
  job_id         uuid references jobs(id) on delete cascade,
  round_number   int not null default 1,
  interview_date date,
  interview_type text,
  notes          text,
  questions      text,
  created_at     timestamptz default now()
);

create table contacts (
  id           uuid primary key default uuid_generate_v4(),
  job_id       uuid references jobs(id) on delete cascade,
  name         text not null,
  title        text,
  email        text,
  linkedin_url text,
  notes        text,
  created_at   timestamptz default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_updated_at
  before update on jobs
  for each row execute function update_updated_at();

alter table jobs               enable row level security;
alter table application_packages enable row level security;
alter table interview_rounds   enable row level security;
alter table contacts           enable row level security;

create policy "Allow all on jobs"                on jobs                for all using (true) with check (true);
create policy "Allow all on application_packages" on application_packages for all using (true) with check (true);
create policy "Allow all on interview_rounds"    on interview_rounds    for all using (true) with check (true);
create policy "Allow all on contacts"            on contacts            for all using (true) with check (true);