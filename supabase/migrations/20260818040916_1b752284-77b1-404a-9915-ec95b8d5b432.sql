CREATE OR REPLACE FUNCTION public.calc_age(_birth_date date)
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE WHEN _birth_date IS NULL THEN NULL
    ELSE date_part('year', age(current_date, _birth_date))::int END
$$;