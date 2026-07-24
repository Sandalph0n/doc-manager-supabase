CREATE TABLE seller_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name_cn TEXT NOT NULL,
  company_name_en TEXT NOT NULL,
  company_name_vi TEXT NOT NULL,
  address_cn TEXT,
  address_en TEXT,
  address_vi TEXT,
  authorized_person TEXT NOT NULL,
  position TEXT,
  tax_code TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  swift_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


ALTER TABLE "public"."customer"
  ADD COLUMN IF NOT EXISTS "bank_account"      text,
  ADD COLUMN IF NOT EXISTS "swift_code"        text,
  ADD COLUMN IF NOT EXISTS "bank_name"         text,
  ADD COLUMN IF NOT EXISTS "bank_address"      text,
  ADD COLUMN IF NOT EXISTS "bank_account_name" text;
 

CREATE TABLE shipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customer(id),
  contract_date DATE,
  shipment_date DATE,
  port_of_loading TEXT,
  port_of_destination TEXT,
  transport_mode TEXT,
  payment_terms TEXT,
  packing_type TEXT,
  shipping_marks TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipment_item (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES shipment(id),
  item_no INTEGER,
  name_cn TEXT,
  name_en TEXT NOT NULL,
  hs_code TEXT,
  specification TEXT,
  unit TEXT,
  num_packages INTEGER,
  quantity INTEGER,
  nw_kg NUMERIC(10, 2),
  gw_kg NUMERIC(10, 2),
  cbm NUMERIC(10, 4),
  unit_price_usd NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE "public"."shipment_item"
  ADD COLUMN IF NOT EXISTS "name_other" text;

ALTER TABLE "public"."shipment_item"
  DROP COLUMN IF EXISTS "unit";

CREATE TABLE shipment_document (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES shipment(id),
  doc_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT,
  is_auto_generated BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------------------------------------------------
-- customer
---------------------------------------------------------------------------------------------------
-- create indices

-- Lookup theo id (thường Postgres tự tạo cho primary key, nhưng check lại)
CREATE INDEX IF NOT EXISTS customer_id_idx ON customer (id);

-- Order by created_at (đang dùng trong query hiện tại)
CREATE INDEX IF NOT EXISTS customer_created_at_idx ON customer (created_at DESC);

---------------------------------------------------------------------------------------------------
-- enable pg_trgm

CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP INDEX IF EXISTS customer_search_idx;
CREATE INDEX customer_search_idx ON customer USING GIN (
  (
    company_name || ' ' ||
    COALESCE(address, '') || ' ' ||
    COALESCE(contact_person, '') || ' ' ||
    COALESCE(phone, '') || ' ' ||
    COALESCE(email, '') ||
    COALESCE(position, '') ||
    COALESCE(tax_code, '')
  ) gin_trgm_ops
);


CREATE OR REPLACE FUNCTION search_customers(q text, p_from int DEFAULT 1, p_to int DEFAULT 20)
RETURNS TABLE (
  id uuid, company_name text, address text,
  contact_person text, phone text, email text,
  created_at timestamptz, updated_at timestamptz,
  total bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    id, company_name, address, contact_person, phone, email, created_at, updated_at,
    COUNT(*) OVER () AS total
  FROM customer
  ORDER BY
    similarity(
      company_name || ' ' || 
      COALESCE(address, '') || ' ' ||
      COALESCE(contact_person, '') || ' ' || 
      COALESCE(phone, '') || ' ' || 
      COALESCE(email, '') || '' || 
      COALESCE(position, '')|| '' || 
      COALESCE(tax_code, ''),
      q
    ) DESC
  LIMIT  (p_to - p_from + 1)
  OFFSET (p_from - 1);
$$;



---------------------------------------------------------------------------------------------------
-- shipment 
---------------------------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS shipment_created_at_idx ON shipment (created_at);


---------------------------------------------------------------------------------------------------
-- shipment items
---------------------------------------------------------------------------------------------------


