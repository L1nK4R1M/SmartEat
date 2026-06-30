# Supabase — schéma applicatif

L'application fonctionne **sans Supabase** (mode invité : préférences en cookie,
placard + listes en `localStorage`). Connecté, elle persiste tout côté Supabase
pour le multi-appareils. Chaque écriture est défensive : en cas d'échec, l'app
retombe silencieusement sur le mode local — rien ne casse.

Exécute le SQL ci-dessous dans **Supabase → SQL Editor** pour activer la
persistance connectée.

## Préférences (`profiles`)

Si la table existe déjà, il suffit d'ajouter la colonne des moments de repas :

```sql
alter table public.profiles
  add column if not exists meal_slots text[] not null default '{dejeuner,diner}';
```

Création complète si besoin :

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  country text,
  store_id text,
  diet_tags text[] default '{}',
  equipment text[] default '{}',
  household_size int default 2,
  meals_per_week int default 5,
  budget numeric default 35,
  ambiance text[] default '{}',
  meal_slots text[] not null default '{dejeuner,diner}',
  excluded_ingredients text[] default '{}',
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles are owner-only"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

## Placard (`pantry`)

```sql
create table if not exists public.pantry (
  user_id uuid not null references auth.users (id) on delete cascade,
  ingredient_id text not null,
  primary key (user_id, ingredient_id)
);

alter table public.pantry enable row level security;

create policy "pantry is owner-only"
  on public.pantry for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## Listes de courses sauvegardées (`shopping_lists`)

Nouvelle table — permet de **garder plusieurs listes de courses**.

```sql
create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  store_name text,
  meal_ids text[] not null default '{}',
  item_count int not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.shopping_lists enable row level security;

create policy "shopping_lists are owner-only"
  on public.shopping_lists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists shopping_lists_user_created_idx
  on public.shopping_lists (user_id, created_at desc);
```
