-- Run this in the Supabase SQL editor once, on a fresh project.

create extension if not exists "pgcrypto";

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  tier text not null check (tier in ('quick', 'advance', 'custom')),
  subject text not null,
  details text,
  link text,
  attachment_path text,
  attachment_name text,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'quoted', 'paid', 'quote_requested', 'delivered')),
  amount_cents integer,
  quote_amount_cents integer,
  quote_checkout_url text,
  stripe_session_id text,
  review_text text,
  rating int check (rating between 1 and 10),
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- No update/delete policy for regular users on purpose — only the service-role
-- key (used server-side in the Stripe webhook and by you, the reviewer) can
-- mark an order paid or attach the finished review.

-- ── Storage bucket for request attachments ──
-- Create the bucket itself from the Supabase dashboard (Storage → New bucket
-- → name it exactly "attachments" → leave it PRIVATE, not public), then run
-- the policies below. Files are stored under a path like
-- "<user_id>/<timestamp>-<filename>" so each person can only reach their own.

create policy "Users can upload their own attachments"
  on storage.objects for insert
  with check (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view their own attachments"
  on storage.objects for select
  using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── If you already ran an earlier version of this file, run this instead ──
-- alter table orders drop constraint if exists orders_status_check;
-- alter table orders add constraint orders_status_check
--   check (status in ('pending_payment', 'quoted', 'paid', 'quote_requested', 'delivered'));
-- alter table orders add column if not exists quote_amount_cents integer;
-- alter table orders add column if not exists quote_checkout_url text;
-- alter table orders add column if not exists attachment_path text;
-- alter table orders add column if not exists attachment_name text;
-- alter table orders drop constraint if exists orders_rating_check;
-- alter table orders add constraint orders_rating_check check (rating between 1 and 10);
-- -- then create the "attachments" bucket in the dashboard and run the two
-- -- storage policies above.

