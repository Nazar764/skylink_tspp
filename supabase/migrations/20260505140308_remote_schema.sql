
  create table "public"."ticket_orders" (
    "id" bigint generated always as identity not null,
    "flight_id" bigint not null,
    "seat_id" bigint not null,
    "seat_number" text not null,
    "seat_class" text not null,
    "passenger_first_name" text not null,
    "passenger_last_name" text not null,
    "passenger_middle_name" text,
    "edrpou" text,
    "passport" text,
    "passport_date" text,
    "phone" text,
    "email" text,
    "payment_type" text,
    "bonus_used" bigint default 0,
    "final_price" numeric not null,
    "status" text default 'created'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."ticket_orders" enable row level security;

alter table "public"."cashier_shifts" alter column "cashier_id" set not null;

alter table "public"."cashier_shifts" alter column "start_time" set not null;

alter table "public"."coupons" alter column "client_id" set not null;

alter table "public"."coupons" alter column "issued_by_admin_id" set not null;

alter table "public"."flight_seats" alter column "flight_id" set not null;

alter table "public"."flights" add column "business_seats_count" integer not null default 0;

alter table "public"."flights" add column "economy_seats_count" integer not null default 0;

alter table "public"."flights" add column "first_class_seats_count" integer not null default 0;

alter table "public"."flights" alter column "price" set not null;

alter table "public"."flights" alter column "seat_class" set default 'Economy'::text;

alter table "public"."hotels" alter column "city" set not null;

alter table "public"."hotels" alter column "name" set not null;

alter table "public"."hotels" enable row level security;

alter table "public"."reviews" alter column "client_id" set not null;

alter table "public"."support_requests" alter column "client_id" set not null;

alter table "public"."tickets" alter column "client_id" set not null;

alter table "public"."tickets" alter column "flight_id" set not null;

CREATE UNIQUE INDEX ticket_orders_pkey ON public.ticket_orders USING btree (id);

CREATE UNIQUE INDEX unique_flight_seat ON public.flight_seats USING btree (flight_id, seat_number);

alter table "public"."ticket_orders" add constraint "ticket_orders_pkey" PRIMARY KEY using index "ticket_orders_pkey";

alter table "public"."flight_seats" add constraint "unique_flight_seat" UNIQUE using index "unique_flight_seat";

grant delete on table "public"."ticket_orders" to "anon";

grant insert on table "public"."ticket_orders" to "anon";

grant references on table "public"."ticket_orders" to "anon";

grant select on table "public"."ticket_orders" to "anon";

grant trigger on table "public"."ticket_orders" to "anon";

grant truncate on table "public"."ticket_orders" to "anon";

grant update on table "public"."ticket_orders" to "anon";

grant delete on table "public"."ticket_orders" to "authenticated";

grant insert on table "public"."ticket_orders" to "authenticated";

grant references on table "public"."ticket_orders" to "authenticated";

grant select on table "public"."ticket_orders" to "authenticated";

grant trigger on table "public"."ticket_orders" to "authenticated";

grant truncate on table "public"."ticket_orders" to "authenticated";

grant update on table "public"."ticket_orders" to "authenticated";

grant delete on table "public"."ticket_orders" to "service_role";

grant insert on table "public"."ticket_orders" to "service_role";

grant references on table "public"."ticket_orders" to "service_role";

grant select on table "public"."ticket_orders" to "service_role";

grant trigger on table "public"."ticket_orders" to "service_role";

grant truncate on table "public"."ticket_orders" to "service_role";

grant update on table "public"."ticket_orders" to "service_role";


  create policy "Enable read access for all users"
  on "public"."flight_seats"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for all users"
  on "public"."flight_seats"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Enable read access for all users"
  on "public"."hotels"
  as permissive
  for select
  to public
using (true);



  create policy "Enable insert for all users"
  on "public"."ticket_orders"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."ticket_orders"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read for all users"
  on "public"."ticket_orders"
  as permissive
  for select
  to public
using (true);



