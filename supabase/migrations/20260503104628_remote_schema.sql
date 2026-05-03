drop extension if exists "pg_net";

create type "public"."request_status" as enum ('open', 'in_progress', 'resolved', 'closed');

create type "public"."seat_class" as enum ('economy', 'premium_economy', 'business', 'first');

create type "public"."ticket_status" as enum ('booked', 'confirmed', 'cancelled', 'refunded');

create sequence "public"."hotels_id_seq";


  create table "public"."admins" (
    "id" bigint generated always as identity not null,
    "full_name" character varying(255) not null,
    "email" character varying(255) not null,
    "password_hash" text not null,
    "employee_key" character varying(50) not null,
    "access_level" integer default 1,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."admins" enable row level security;


  create table "public"."cashier_shifts" (
    "id" bigint generated always as identity not null,
    "cashier_id" bigint,
    "start_time" timestamp with time zone default now(),
    "end_time" timestamp with time zone,
    "total_revenue" numeric(15,2) default 0
      );


alter table "public"."cashier_shifts" enable row level security;


  create table "public"."cashiers" (
    "id" bigint generated always as identity not null,
    "full_name" character varying(255) not null,
    "email" character varying(255) not null,
    "password_hash" text not null,
    "employee_key" character varying(50) not null,
    "cash_desk_number" character varying(20),
    "created_at" timestamp with time zone default now()
      );


alter table "public"."cashiers" enable row level security;


  create table "public"."clients" (
    "id" bigint generated always as identity not null,
    "full_name" character varying(255) not null,
    "email" character varying(255) not null,
    "password_hash" text not null,
    "phone_number" character varying(20),
    "bonus_points" integer default 0,
    "created_at" timestamp with time zone default now(),
    "avatar_url" text
      );


alter table "public"."clients" enable row level security;


  create table "public"."coupons" (
    "id" bigint generated always as identity not null,
    "client_id" bigint,
    "issued_by_admin_id" bigint,
    "discount_amount" numeric(10,2) not null,
    "is_used" boolean default false
      );


alter table "public"."coupons" enable row level security;


  create table "public"."flight_seats" (
    "id" bigint generated always as identity not null,
    "flight_id" bigint,
    "seat_number" character varying(10) not null,
    "seat_class" text not null default 'Economy'::text,
    "is_occupied" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."flight_seats" enable row level security;


  create table "public"."flights" (
    "id" bigint generated always as identity not null,
    "flight_number" character varying(20) not null,
    "departure_airport" text not null,
    "arrival_airport" text not null,
    "departure_time" timestamp with time zone not null,
    "arrival_time" timestamp with time zone not null,
    "price" integer,
    "duration" text,
    "from_image" text,
    "to_image" text,
    "seat_class" text default 'economy'::public.seat_class
      );


alter table "public"."flights" enable row level security;


  create table "public"."hotels" (
    "id" integer not null default nextval('public.hotels_id_seq'::regclass),
    "city" text,
    "name" text,
    "price" text,
    "image" text
      );



  create table "public"."reviews" (
    "id" bigint generated always as identity not null,
    "client_id" bigint,
    "rating" integer not null,
    "text" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."reviews" enable row level security;


  create table "public"."support_agents" (
    "id" bigint generated always as identity not null,
    "full_name" character varying(255) not null,
    "email" character varying(255) not null,
    "password_hash" text not null,
    "employee_key" character varying(50) not null,
    "department" character varying(100),
    "created_at" timestamp with time zone default now()
      );


alter table "public"."support_agents" enable row level security;


  create table "public"."support_requests" (
    "id" bigint generated always as identity not null,
    "client_id" bigint,
    "agent_id" bigint,
    "subject" character varying(255) not null,
    "description" text not null,
    "status" public.request_status default 'open'::public.request_status
      );


alter table "public"."support_requests" enable row level security;


  create table "public"."tickets" (
    "id" bigint generated always as identity not null,
    "client_id" bigint,
    "flight_id" bigint,
    "seat_number" character varying(10) not null,
    "status" public.ticket_status default 'booked'::public.ticket_status
      );


alter table "public"."tickets" enable row level security;

alter sequence "public"."hotels_id_seq" owned by "public"."hotels"."id";

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);

CREATE UNIQUE INDEX admins_employee_key_key ON public.admins USING btree (employee_key);

CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (id);

CREATE UNIQUE INDEX cashier_shifts_pkey ON public.cashier_shifts USING btree (id);

CREATE UNIQUE INDEX cashiers_email_key ON public.cashiers USING btree (email);

CREATE UNIQUE INDEX cashiers_employee_key_key ON public.cashiers USING btree (employee_key);

CREATE UNIQUE INDEX cashiers_pkey ON public.cashiers USING btree (id);

CREATE UNIQUE INDEX clients_email_key ON public.clients USING btree (email);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX coupons_pkey ON public.coupons USING btree (id);

CREATE UNIQUE INDEX flight_seats_flight_id_seat_number_key ON public.flight_seats USING btree (flight_id, seat_number);

CREATE UNIQUE INDEX flight_seats_pkey ON public.flight_seats USING btree (id);

CREATE UNIQUE INDEX flights_flight_number_key ON public.flights USING btree (flight_number);

CREATE UNIQUE INDEX flights_pkey ON public.flights USING btree (id);

CREATE UNIQUE INDEX hotels_pkey ON public.hotels USING btree (id);

CREATE INDEX idx_coupons_client ON public.coupons USING btree (client_id);

CREATE INDEX idx_requests_client ON public.support_requests USING btree (client_id);

CREATE INDEX idx_reviews_client ON public.reviews USING btree (client_id);

CREATE INDEX idx_tickets_client ON public.tickets USING btree (client_id);

CREATE INDEX idx_tickets_flight ON public.tickets USING btree (flight_id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX support_agents_email_key ON public.support_agents USING btree (email);

CREATE UNIQUE INDEX support_agents_employee_key_key ON public.support_agents USING btree (employee_key);

CREATE UNIQUE INDEX support_agents_pkey ON public.support_agents USING btree (id);

CREATE UNIQUE INDEX support_requests_pkey ON public.support_requests USING btree (id);

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

alter table "public"."admins" add constraint "admins_pkey" PRIMARY KEY using index "admins_pkey";

alter table "public"."cashier_shifts" add constraint "cashier_shifts_pkey" PRIMARY KEY using index "cashier_shifts_pkey";

alter table "public"."cashiers" add constraint "cashiers_pkey" PRIMARY KEY using index "cashiers_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."coupons" add constraint "coupons_pkey" PRIMARY KEY using index "coupons_pkey";

alter table "public"."flight_seats" add constraint "flight_seats_pkey" PRIMARY KEY using index "flight_seats_pkey";

alter table "public"."flights" add constraint "flights_pkey" PRIMARY KEY using index "flights_pkey";

alter table "public"."hotels" add constraint "hotels_pkey" PRIMARY KEY using index "hotels_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."support_agents" add constraint "support_agents_pkey" PRIMARY KEY using index "support_agents_pkey";

alter table "public"."support_requests" add constraint "support_requests_pkey" PRIMARY KEY using index "support_requests_pkey";

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."admins" add constraint "admins_email_key" UNIQUE using index "admins_email_key";

alter table "public"."admins" add constraint "admins_employee_key_key" UNIQUE using index "admins_employee_key_key";

alter table "public"."cashier_shifts" add constraint "cashier_shifts_cashier_id_fkey" FOREIGN KEY (cashier_id) REFERENCES public.cashiers(id) ON DELETE CASCADE not valid;

alter table "public"."cashier_shifts" validate constraint "cashier_shifts_cashier_id_fkey";

alter table "public"."cashier_shifts" add constraint "cashier_shifts_total_revenue_check" CHECK ((total_revenue >= (0)::numeric)) not valid;

alter table "public"."cashier_shifts" validate constraint "cashier_shifts_total_revenue_check";

alter table "public"."cashiers" add constraint "cashiers_email_key" UNIQUE using index "cashiers_email_key";

alter table "public"."cashiers" add constraint "cashiers_employee_key_key" UNIQUE using index "cashiers_employee_key_key";

alter table "public"."clients" add constraint "clients_bonus_points_check" CHECK ((bonus_points >= 0)) not valid;

alter table "public"."clients" validate constraint "clients_bonus_points_check";

alter table "public"."clients" add constraint "clients_email_key" UNIQUE using index "clients_email_key";

alter table "public"."coupons" add constraint "coupons_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL not valid;

alter table "public"."coupons" validate constraint "coupons_client_id_fkey";

alter table "public"."coupons" add constraint "coupons_discount_amount_check" CHECK ((discount_amount > (0)::numeric)) not valid;

alter table "public"."coupons" validate constraint "coupons_discount_amount_check";

alter table "public"."coupons" add constraint "coupons_issued_by_admin_id_fkey" FOREIGN KEY (issued_by_admin_id) REFERENCES public.admins(id) ON DELETE SET NULL not valid;

alter table "public"."coupons" validate constraint "coupons_issued_by_admin_id_fkey";

alter table "public"."flight_seats" add constraint "flight_seats_flight_id_fkey" FOREIGN KEY (flight_id) REFERENCES public.flights(id) ON DELETE CASCADE not valid;

alter table "public"."flight_seats" validate constraint "flight_seats_flight_id_fkey";

alter table "public"."flight_seats" add constraint "flight_seats_flight_id_seat_number_key" UNIQUE using index "flight_seats_flight_id_seat_number_key";

alter table "public"."flights" add constraint "flights_flight_number_key" UNIQUE using index "flights_flight_number_key";

alter table "public"."reviews" add constraint "reviews_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_client_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."support_agents" add constraint "support_agents_email_key" UNIQUE using index "support_agents_email_key";

alter table "public"."support_agents" add constraint "support_agents_employee_key_key" UNIQUE using index "support_agents_employee_key_key";

alter table "public"."support_requests" add constraint "support_requests_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES public.support_agents(id) ON DELETE SET NULL not valid;

alter table "public"."support_requests" validate constraint "support_requests_agent_id_fkey";

alter table "public"."support_requests" add constraint "support_requests_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE not valid;

alter table "public"."support_requests" validate constraint "support_requests_client_id_fkey";

alter table "public"."tickets" add constraint "tickets_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "tickets_client_id_fkey";

alter table "public"."tickets" add constraint "tickets_flight_id_fkey" FOREIGN KEY (flight_id) REFERENCES public.flights(id) ON DELETE RESTRICT not valid;

alter table "public"."tickets" validate constraint "tickets_flight_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.clients (full_name, email, password_hash, avatar_url)
  VALUES (
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name',
      SPLIT_PART(COALESCE(new.email, 'user@unknown'), '@', 1)
    ),
    COALESCE(new.email, new.id::TEXT || '@oauth.local'),
    'managed_by_supabase_auth',
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;

  RETURN NEW;
END;
$function$
;

grant delete on table "public"."admins" to "anon";

grant insert on table "public"."admins" to "anon";

grant references on table "public"."admins" to "anon";

grant select on table "public"."admins" to "anon";

grant trigger on table "public"."admins" to "anon";

grant truncate on table "public"."admins" to "anon";

grant update on table "public"."admins" to "anon";

grant delete on table "public"."admins" to "authenticated";

grant insert on table "public"."admins" to "authenticated";

grant references on table "public"."admins" to "authenticated";

grant select on table "public"."admins" to "authenticated";

grant trigger on table "public"."admins" to "authenticated";

grant truncate on table "public"."admins" to "authenticated";

grant update on table "public"."admins" to "authenticated";

grant delete on table "public"."admins" to "service_role";

grant insert on table "public"."admins" to "service_role";

grant references on table "public"."admins" to "service_role";

grant select on table "public"."admins" to "service_role";

grant trigger on table "public"."admins" to "service_role";

grant truncate on table "public"."admins" to "service_role";

grant update on table "public"."admins" to "service_role";

grant delete on table "public"."cashier_shifts" to "anon";

grant insert on table "public"."cashier_shifts" to "anon";

grant references on table "public"."cashier_shifts" to "anon";

grant select on table "public"."cashier_shifts" to "anon";

grant trigger on table "public"."cashier_shifts" to "anon";

grant truncate on table "public"."cashier_shifts" to "anon";

grant update on table "public"."cashier_shifts" to "anon";

grant delete on table "public"."cashier_shifts" to "authenticated";

grant insert on table "public"."cashier_shifts" to "authenticated";

grant references on table "public"."cashier_shifts" to "authenticated";

grant select on table "public"."cashier_shifts" to "authenticated";

grant trigger on table "public"."cashier_shifts" to "authenticated";

grant truncate on table "public"."cashier_shifts" to "authenticated";

grant update on table "public"."cashier_shifts" to "authenticated";

grant delete on table "public"."cashier_shifts" to "service_role";

grant insert on table "public"."cashier_shifts" to "service_role";

grant references on table "public"."cashier_shifts" to "service_role";

grant select on table "public"."cashier_shifts" to "service_role";

grant trigger on table "public"."cashier_shifts" to "service_role";

grant truncate on table "public"."cashier_shifts" to "service_role";

grant update on table "public"."cashier_shifts" to "service_role";

grant delete on table "public"."cashiers" to "anon";

grant insert on table "public"."cashiers" to "anon";

grant references on table "public"."cashiers" to "anon";

grant select on table "public"."cashiers" to "anon";

grant trigger on table "public"."cashiers" to "anon";

grant truncate on table "public"."cashiers" to "anon";

grant update on table "public"."cashiers" to "anon";

grant delete on table "public"."cashiers" to "authenticated";

grant insert on table "public"."cashiers" to "authenticated";

grant references on table "public"."cashiers" to "authenticated";

grant select on table "public"."cashiers" to "authenticated";

grant trigger on table "public"."cashiers" to "authenticated";

grant truncate on table "public"."cashiers" to "authenticated";

grant update on table "public"."cashiers" to "authenticated";

grant delete on table "public"."cashiers" to "service_role";

grant insert on table "public"."cashiers" to "service_role";

grant references on table "public"."cashiers" to "service_role";

grant select on table "public"."cashiers" to "service_role";

grant trigger on table "public"."cashiers" to "service_role";

grant truncate on table "public"."cashiers" to "service_role";

grant update on table "public"."cashiers" to "service_role";

grant delete on table "public"."clients" to "anon";

grant insert on table "public"."clients" to "anon";

grant references on table "public"."clients" to "anon";

grant select on table "public"."clients" to "anon";

grant trigger on table "public"."clients" to "anon";

grant truncate on table "public"."clients" to "anon";

grant update on table "public"."clients" to "anon";

grant delete on table "public"."clients" to "authenticated";

grant insert on table "public"."clients" to "authenticated";

grant references on table "public"."clients" to "authenticated";

grant select on table "public"."clients" to "authenticated";

grant trigger on table "public"."clients" to "authenticated";

grant truncate on table "public"."clients" to "authenticated";

grant update on table "public"."clients" to "authenticated";

grant delete on table "public"."clients" to "service_role";

grant insert on table "public"."clients" to "service_role";

grant references on table "public"."clients" to "service_role";

grant select on table "public"."clients" to "service_role";

grant trigger on table "public"."clients" to "service_role";

grant truncate on table "public"."clients" to "service_role";

grant update on table "public"."clients" to "service_role";

grant delete on table "public"."coupons" to "anon";

grant insert on table "public"."coupons" to "anon";

grant references on table "public"."coupons" to "anon";

grant select on table "public"."coupons" to "anon";

grant trigger on table "public"."coupons" to "anon";

grant truncate on table "public"."coupons" to "anon";

grant update on table "public"."coupons" to "anon";

grant delete on table "public"."coupons" to "authenticated";

grant insert on table "public"."coupons" to "authenticated";

grant references on table "public"."coupons" to "authenticated";

grant select on table "public"."coupons" to "authenticated";

grant trigger on table "public"."coupons" to "authenticated";

grant truncate on table "public"."coupons" to "authenticated";

grant update on table "public"."coupons" to "authenticated";

grant delete on table "public"."coupons" to "service_role";

grant insert on table "public"."coupons" to "service_role";

grant references on table "public"."coupons" to "service_role";

grant select on table "public"."coupons" to "service_role";

grant trigger on table "public"."coupons" to "service_role";

grant truncate on table "public"."coupons" to "service_role";

grant update on table "public"."coupons" to "service_role";

grant delete on table "public"."flight_seats" to "anon";

grant insert on table "public"."flight_seats" to "anon";

grant references on table "public"."flight_seats" to "anon";

grant select on table "public"."flight_seats" to "anon";

grant trigger on table "public"."flight_seats" to "anon";

grant truncate on table "public"."flight_seats" to "anon";

grant update on table "public"."flight_seats" to "anon";

grant delete on table "public"."flight_seats" to "authenticated";

grant insert on table "public"."flight_seats" to "authenticated";

grant references on table "public"."flight_seats" to "authenticated";

grant select on table "public"."flight_seats" to "authenticated";

grant trigger on table "public"."flight_seats" to "authenticated";

grant truncate on table "public"."flight_seats" to "authenticated";

grant update on table "public"."flight_seats" to "authenticated";

grant delete on table "public"."flight_seats" to "service_role";

grant insert on table "public"."flight_seats" to "service_role";

grant references on table "public"."flight_seats" to "service_role";

grant select on table "public"."flight_seats" to "service_role";

grant trigger on table "public"."flight_seats" to "service_role";

grant truncate on table "public"."flight_seats" to "service_role";

grant update on table "public"."flight_seats" to "service_role";

grant delete on table "public"."flights" to "anon";

grant insert on table "public"."flights" to "anon";

grant references on table "public"."flights" to "anon";

grant select on table "public"."flights" to "anon";

grant trigger on table "public"."flights" to "anon";

grant truncate on table "public"."flights" to "anon";

grant update on table "public"."flights" to "anon";

grant delete on table "public"."flights" to "authenticated";

grant insert on table "public"."flights" to "authenticated";

grant references on table "public"."flights" to "authenticated";

grant select on table "public"."flights" to "authenticated";

grant trigger on table "public"."flights" to "authenticated";

grant truncate on table "public"."flights" to "authenticated";

grant update on table "public"."flights" to "authenticated";

grant delete on table "public"."flights" to "service_role";

grant insert on table "public"."flights" to "service_role";

grant references on table "public"."flights" to "service_role";

grant select on table "public"."flights" to "service_role";

grant trigger on table "public"."flights" to "service_role";

grant truncate on table "public"."flights" to "service_role";

grant update on table "public"."flights" to "service_role";

grant delete on table "public"."hotels" to "anon";

grant insert on table "public"."hotels" to "anon";

grant references on table "public"."hotels" to "anon";

grant select on table "public"."hotels" to "anon";

grant trigger on table "public"."hotels" to "anon";

grant truncate on table "public"."hotels" to "anon";

grant update on table "public"."hotels" to "anon";

grant delete on table "public"."hotels" to "authenticated";

grant insert on table "public"."hotels" to "authenticated";

grant references on table "public"."hotels" to "authenticated";

grant select on table "public"."hotels" to "authenticated";

grant trigger on table "public"."hotels" to "authenticated";

grant truncate on table "public"."hotels" to "authenticated";

grant update on table "public"."hotels" to "authenticated";

grant delete on table "public"."hotels" to "service_role";

grant insert on table "public"."hotels" to "service_role";

grant references on table "public"."hotels" to "service_role";

grant select on table "public"."hotels" to "service_role";

grant trigger on table "public"."hotels" to "service_role";

grant truncate on table "public"."hotels" to "service_role";

grant update on table "public"."hotels" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."support_agents" to "anon";

grant insert on table "public"."support_agents" to "anon";

grant references on table "public"."support_agents" to "anon";

grant select on table "public"."support_agents" to "anon";

grant trigger on table "public"."support_agents" to "anon";

grant truncate on table "public"."support_agents" to "anon";

grant update on table "public"."support_agents" to "anon";

grant delete on table "public"."support_agents" to "authenticated";

grant insert on table "public"."support_agents" to "authenticated";

grant references on table "public"."support_agents" to "authenticated";

grant select on table "public"."support_agents" to "authenticated";

grant trigger on table "public"."support_agents" to "authenticated";

grant truncate on table "public"."support_agents" to "authenticated";

grant update on table "public"."support_agents" to "authenticated";

grant delete on table "public"."support_agents" to "service_role";

grant insert on table "public"."support_agents" to "service_role";

grant references on table "public"."support_agents" to "service_role";

grant select on table "public"."support_agents" to "service_role";

grant trigger on table "public"."support_agents" to "service_role";

grant truncate on table "public"."support_agents" to "service_role";

grant update on table "public"."support_agents" to "service_role";

grant delete on table "public"."support_requests" to "anon";

grant insert on table "public"."support_requests" to "anon";

grant references on table "public"."support_requests" to "anon";

grant select on table "public"."support_requests" to "anon";

grant trigger on table "public"."support_requests" to "anon";

grant truncate on table "public"."support_requests" to "anon";

grant update on table "public"."support_requests" to "anon";

grant delete on table "public"."support_requests" to "authenticated";

grant insert on table "public"."support_requests" to "authenticated";

grant references on table "public"."support_requests" to "authenticated";

grant select on table "public"."support_requests" to "authenticated";

grant trigger on table "public"."support_requests" to "authenticated";

grant truncate on table "public"."support_requests" to "authenticated";

grant update on table "public"."support_requests" to "authenticated";

grant delete on table "public"."support_requests" to "service_role";

grant insert on table "public"."support_requests" to "service_role";

grant references on table "public"."support_requests" to "service_role";

grant select on table "public"."support_requests" to "service_role";

grant trigger on table "public"."support_requests" to "service_role";

grant truncate on table "public"."support_requests" to "service_role";

grant update on table "public"."support_requests" to "service_role";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";


  create policy "Allow insert for everyone"
  on "public"."clients"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can read own client profile"
  on "public"."clients"
  as permissive
  for select
  to authenticated
using (((email)::text = (auth.jwt() ->> 'email'::text)));



  create policy "Users can update own client profile"
  on "public"."clients"
  as permissive
  for update
  to authenticated
using (((email)::text = (auth.jwt() ->> 'email'::text)))
with check (((email)::text = (auth.jwt() ->> 'email'::text)));



  create policy "Users can view own client data"
  on "public"."clients"
  as permissive
  for select
  to public
using (((auth.jwt() ->> 'email'::text) = (email)::text));



  create policy "Allow read flight seats"
  on "public"."flight_seats"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."flights"
  as permissive
  for select
  to public
using (true);



  create policy "Anyone can read reviews"
  on "public"."reviews"
  as permissive
  for select
  to public
using (true);



  create policy "Authenticated users can insert reviews"
  on "public"."reviews"
  as permissive
  for insert
  to public
with check (((auth.uid() IS NOT NULL) AND (client_id = ( SELECT clients.id AS client_id
   FROM public.clients
  WHERE ((clients.email)::text = (auth.jwt() ->> 'email'::text))))));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Auth delete avatars"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'avatars'::text));



  create policy "Auth update avatars"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'avatars'::text))
with check ((bucket_id = 'avatars'::text));



  create policy "Auth upload avatars"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'avatars'::text));



  create policy "Public read avatars"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



