-- Rice Resort: anonymous results + public aggregate stats.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
--
-- Security model: the site uses the public "anon" key. Row Level Security
-- lets anonymous visitors INSERT results but never read individual rows.
-- The only thing anyone can read is the aggregated get_stats() output.

create table if not exists public.results (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  respondent_id  uuid not null,                 -- random per-browser id, not tied to any person
  actual_college text not null,
  result_college text not null,
  match          smallint not null,
  runner_up      text,
  answers        smallint[] not null,
  traits         jsonb not null,
  constraint valid_actual check (actual_college in ('baker','brown','chao','duncan','hanszen','jones','lovett','martel','mcmurtry','sidrich','wiess','willrice','none')),
  constraint valid_result check (result_college in ('baker','brown','chao','duncan','hanszen','jones','lovett','martel','mcmurtry','sidrich','wiess','willrice')),
  constraint valid_match check (match between 0 and 100),
  constraint valid_answers check (array_length(answers, 1) = 20)
);

create index if not exists results_respondent_idx on public.results (respondent_id, created_at desc);

alter table public.results enable row level security;

drop policy if exists "anyone can submit a result" on public.results;
create policy "anyone can submit a result" on public.results
  for insert to anon with check (true);
-- (no select policy: individual rows are not readable with the public key)

-- Aggregates for the homepage. Uses each respondent's most recent result so
-- retakes don't double count.
create or replace function public.get_stats()
returns json
language sql
security definer
set search_path = public
as $$
  with latest as (
    select distinct on (respondent_id) *
    from results
    order by respondent_id, created_at desc
  ),
  students as (select * from latest where actual_college <> 'none'),
  per_college as (
    select actual_college as college,
           count(*) as n,
           avg((actual_college = result_college)::int) as hit_rate
    from students group by actual_college
  )
  select json_build_object(
    'total', (select count(*) from latest),
    'students', (select count(*) from students),
    'matched_pct', (select round(100 * avg((actual_college = result_college)::int)) from students),
    'most_correct', (select college from per_college where n >= 5 order by hit_rate desc, n desc limit 1),
    'most_chaotic', (
      select result_college from latest
      group by result_college having count(*) >= 5
      order by avg((traits->>'chaosWeirdness')::numeric) desc limit 1
    ),
    'common_resort', (
      select json_build_array(actual_college, result_college) from students
      where actual_college <> result_college
      group by actual_college, result_college
      order by count(*) desc limit 1
    ),
    'heatmap', (
      select coalesce(json_agg(json_build_array(actual_college, result_college, n)), '[]'::json)
      from (select actual_college, result_college, count(*) as n from students group by 1, 2) h
    )
  );
$$;

revoke all on function public.get_stats() from public;
grant execute on function public.get_stats() to anon;

-- ---------------------------------------------------------------------------
-- Feedback: "what's the real stereotype of your college?" + general comments.
-- Insert-only for visitors, like results. Read it in Table Editor → feedback.
-- Nothing here is shown on the site (free text isn't moderated).

create table if not exists public.feedback (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  respondent_id  uuid not null,
  about_college  text not null,
  stereotype     text,
  accuracy       text,
  comment        text,
  actual_college text,
  result_college text,
  constraint valid_about check (about_college in ('baker','brown','chao','duncan','hanszen','jones','lovett','martel','mcmurtry','sidrich','wiess','willrice')),
  constraint valid_accuracy check (accuracy is null or accuracy in ('nailed','kinda','nope')),
  constraint stereotype_len check (stereotype is null or char_length(stereotype) <= 280),
  constraint comment_len check (comment is null or char_length(comment) <= 1000),
  constraint not_empty check (coalesce(stereotype, '') <> '' or coalesce(comment, '') <> '' or accuracy is not null)
);

alter table public.feedback enable row level security;

drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback" on public.feedback
  for insert to anon with check (true);
