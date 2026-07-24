
CREATE OR REPLACE FUNCTION duplicate_shipment(
  p_source_id  uuid,
  p_doc_number text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;