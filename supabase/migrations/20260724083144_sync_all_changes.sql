SET check_function_bodies = false;
ALTER TABLE public.shipment_item DROP COLUMN unit;
CREATE FUNCTION public.duplicate_shipment(p_source_id uuid, p_doc_number text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_new_id uuid := gen_random_uuid();
BEGIN
  -- 1. Copy shipment với id mới, doc_number mới, created_at = now()
  INSERT INTO shipment (
    id, doc_number, customer_id,
    contract_date, shipment_date, port_of_loading, port_of_destination,
    transport_mode, payment_terms, packing_type, shipping_marks, status
  )
  SELECT
    v_new_id, p_doc_number, customer_id,
    contract_date, shipment_date, port_of_loading, port_of_destination,
    transport_mode, payment_terms, packing_type, shipping_marks, status
  FROM shipment
  WHERE id = p_source_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Shipment % không tồn tại', p_source_id;
  END IF;

  -- 2. Copy toàn bộ items sang shipment mới
  INSERT INTO shipment_item (
    id, shipment_id, item_no,
    name_en, name_cn, name_other, hs_code, specification,
    quantity, unit_price_usd, num_packages, nw_kg, gw_kg, cbm
  )
  SELECT
    gen_random_uuid(), v_new_id, item_no,
    name_en, name_cn, name_other, hs_code, specification,
    quantity, unit_price_usd, num_packages, nw_kg, gw_kg, cbm
  FROM shipment_item
  WHERE shipment_id = p_source_id;

  -- Trả về id của shipment mới để UI navigate tới
  RETURN v_new_id;
END;
$function$;
GRANT ALL ON FUNCTION public.duplicate_shipment(uuid, text) TO anon;
GRANT ALL ON FUNCTION public.duplicate_shipment(uuid, text) TO authenticated;
GRANT ALL ON FUNCTION public.duplicate_shipment(uuid, text) TO service_role;
ALTER TABLE public.shipment_item ADD COLUMN name_other text;

-- Storage bucket (db diff không capture được, thêm thủ công)
INSERT INTO storage.buckets (id, name, public)
VALUES ('shipment-documents', 'shipment-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated can upload shipment documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'shipment-documents');

CREATE POLICY "Authenticated can read shipment documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'shipment-documents');

CREATE POLICY "Authenticated can delete shipment documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'shipment-documents');
