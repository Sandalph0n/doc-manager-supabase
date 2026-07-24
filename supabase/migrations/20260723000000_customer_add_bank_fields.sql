ALTER TABLE "public"."customer"
  ADD COLUMN IF NOT EXISTS "bank_account"      text,
  ADD COLUMN IF NOT EXISTS "swift_code"        text,
  ADD COLUMN IF NOT EXISTS "bank_name"         text,
  ADD COLUMN IF NOT EXISTS "bank_address"      text,
  ADD COLUMN IF NOT EXISTS "bank_account_name" text;
