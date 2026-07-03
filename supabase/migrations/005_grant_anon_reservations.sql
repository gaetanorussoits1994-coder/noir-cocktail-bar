begin;

grant select, insert
on table public.reservations
to anon;

commit;
