BEGIN;

DO $$
DECLARE
  users_id_type oid;
  users_id_type_name text;
BEGIN
  IF to_regclass('public."Users"') IS NULL THEN
    RAISE EXCEPTION 'Expected existing table public."Users" was not found; migration stopped without changing the schema.';
  END IF;

  SELECT a.atttypid, format_type(a.atttypid, a.atttypmod)
    INTO users_id_type, users_id_type_name
    FROM pg_attribute a
   WHERE a.attrelid = 'public."Users"'::regclass
     AND a.attname = 'id'
     AND a.attnum > 0
     AND NOT a.attisdropped;

  IF users_id_type IS DISTINCT FROM 'character varying'::regtype THEN
    RAISE EXCEPTION 'Expected public."Users".id to be varchar; found %. Migration stopped.', users_id_type_name;
  END IF;

  IF EXISTS (
    SELECT 1
      FROM pg_attribute a
     WHERE a.attrelid = 'public."Users"'::regclass
       AND a.attname = 'is_active'
       AND a.attnum > 0
       AND NOT a.attisdropped
       AND a.atttypid <> 'boolean'::regtype
  ) THEN
    RAISE EXCEPTION 'public."Users".is_active exists but is not boolean. Migration stopped.';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM pg_attribute a
     WHERE a.attrelid = 'public."Users"'::regclass
       AND a.attname = 'is_active'
       AND a.attnum > 0
       AND NOT a.attisdropped
       AND NOT a.attnotnull
  ) THEN
    RAISE EXCEPTION 'public."Users".is_active is nullable. Resolve existing NULL account states before migrating.';
  END IF;
END
$$;

ALTER TABLE public."Users"
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL
    REFERENCES public."Users"(id),
  token_hash text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  revoked_at timestamp with time zone
);

DO $$
DECLARE
  users_id_type oid;
  sessions_user_id_type oid;
  missing_columns text[];
BEGIN
  SELECT a.atttypid
    INTO users_id_type
    FROM pg_attribute a
   WHERE a.attrelid = 'public."Users"'::regclass
     AND a.attname = 'id'
     AND a.attnum > 0
     AND NOT a.attisdropped;

  SELECT array_agg(required.column_name)
    INTO missing_columns
    FROM (VALUES
      ('id'),
      ('user_id'),
      ('token_hash'),
      ('created_at'),
      ('expires_at'),
      ('revoked_at')
    ) AS required(column_name)
   WHERE NOT EXISTS (
     SELECT 1
       FROM pg_attribute a
      WHERE a.attrelid = 'public.sessions'::regclass
        AND a.attname = required.column_name
        AND a.attnum > 0
        AND NOT a.attisdropped
   );

  IF missing_columns IS NOT NULL THEN
    RAISE EXCEPTION 'Existing public.sessions is missing required columns (%). No existing table or records were replaced.', array_to_string(missing_columns, ', ');
  END IF;

  SELECT a.atttypid
    INTO sessions_user_id_type
    FROM pg_attribute a
   WHERE a.attrelid = 'public.sessions'::regclass
     AND a.attname = 'user_id'
     AND a.attnum > 0
     AND NOT a.attisdropped;

  IF sessions_user_id_type IS DISTINCT FROM users_id_type THEN
    RAISE EXCEPTION 'public.sessions.user_id type does not match public."Users".id; migration stopped without changing session records.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_attribute
     WHERE attrelid = 'public.sessions'::regclass
       AND attname = 'id'
       AND atttypid = 'uuid'::regtype
       AND attnotnull
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_attribute
     WHERE attrelid = 'public.sessions'::regclass
       AND attname = 'token_hash'
       AND atttypid = 'text'::regtype
       AND attnotnull
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_attribute
     WHERE attrelid = 'public.sessions'::regclass
       AND attname = 'user_id'
       AND attnotnull
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_attribute
     WHERE attrelid = 'public.sessions'::regclass
       AND attname = 'created_at'
       AND atttypid = 'timestamp with time zone'::regtype
       AND attnotnull
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_attribute
     WHERE attrelid = 'public.sessions'::regclass
       AND attname = 'expires_at'
       AND atttypid = 'timestamp with time zone'::regtype
       AND attnotnull
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_attribute
     WHERE attrelid = 'public.sessions'::regclass
       AND attname = 'revoked_at'
       AND atttypid = 'timestamp with time zone'::regtype
       AND NOT attnotnull
  ) THEN
    RAISE EXCEPTION 'Existing public.sessions has incompatible column types or nullability. Inspect it and reconcile manually; existing records were not replaced.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint c
     WHERE c.conrelid = 'public.sessions'::regclass
       AND c.contype = 'f'
       AND c.confrelid = 'public."Users"'::regclass
       AND c.conkey = ARRAY[
         (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.sessions'::regclass AND attname = 'user_id')
       ]::smallint[]
       AND c.confkey = ARRAY[
         (SELECT attnum FROM pg_attribute WHERE attrelid = 'public."Users"'::regclass AND attname = 'id')
       ]::smallint[]
  ) THEN
    IF EXISTS (
      SELECT 1
        FROM public.sessions s
        LEFT JOIN public."Users" u ON u.id = s.user_id
       WHERE u.id IS NULL
    ) THEN
      RAISE EXCEPTION 'Existing public.sessions contains user_id values without a matching public."Users" row; foreign key was not added.';
    END IF;
    ALTER TABLE public.sessions
      ADD CONSTRAINT sessions_user_id_users_id_fk
      FOREIGN KEY (user_id) REFERENCES public."Users"(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint c
     WHERE c.conrelid = 'public.sessions'::regclass
       AND c.contype = 'p'
       AND c.conkey = ARRAY[
         (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.sessions'::regclass AND attname = 'id')
       ]::smallint[]
  ) THEN
    IF EXISTS (
      SELECT id
        FROM public.sessions
       GROUP BY id
      HAVING id IS NULL OR count(*) > 1
    ) THEN
      RAISE EXCEPTION 'Existing public.sessions has null or duplicate id values; primary key was not added.';
    END IF;
    ALTER TABLE public.sessions
      ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
      FROM pg_index i
     WHERE i.indrelid = 'public.sessions'::regclass
       AND i.indisunique
       AND i.indisvalid
       AND i.indnkeyatts = 1
       AND i.indkey[0] = (
         SELECT attnum FROM pg_attribute
          WHERE attrelid = 'public.sessions'::regclass AND attname = 'token_hash'
       )
  ) THEN
    IF EXISTS (
      SELECT token_hash
        FROM public.sessions
       GROUP BY token_hash
      HAVING token_hash IS NULL OR count(*) > 1
    ) THEN
      RAISE EXCEPTION 'Existing public.sessions has null or duplicate token_hash values; unique constraint was not added.';
    END IF;
    ALTER TABLE public.sessions
      ADD CONSTRAINT sessions_token_hash_key UNIQUE (token_hash);
  END IF;
END
$$;

ALTER TABLE public.sessions
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_row record;
BEGIN
  FOR policy_row IN
    SELECT policyname
      FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename = 'sessions'
       AND (
         'public' = ANY(roles)
         OR 'anon' = ANY(roles)
         OR 'authenticated' = ANY(roles)
       )
  LOOP
    EXECUTE format('DROP POLICY %I ON public.sessions', policy_row.policyname);
  END LOOP;
END
$$;

REVOKE ALL ON TABLE public."Users" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.sessions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."Users" TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sessions TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_index i
     WHERE i.indrelid = 'public.sessions'::regclass
       AND i.indisvalid
       AND i.indpred IS NULL
       AND i.indnkeyatts >= 1
       AND i.indkey[0] = (
         SELECT attnum FROM pg_attribute
          WHERE attrelid = 'public.sessions'::regclass AND attname = 'user_id'
       )
  ) THEN
    CREATE INDEX sessions_user_id_idx ON public.sessions(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_index i
     WHERE i.indrelid = 'public.sessions'::regclass
       AND i.indisvalid
       AND i.indpred IS NULL
       AND i.indnkeyatts >= 1
       AND i.indkey[0] = (
         SELECT attnum FROM pg_attribute
          WHERE attrelid = 'public.sessions'::regclass AND attname = 'expires_at'
       )
  ) THEN
    CREATE INDEX sessions_expires_at_idx ON public.sessions(expires_at);
  END IF;
END
$$;

COMMIT;
