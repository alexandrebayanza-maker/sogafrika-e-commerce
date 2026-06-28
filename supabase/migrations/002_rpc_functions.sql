-- Additional RPC functions for SogAfrika
-- Run this after the initial schema migration

-- Decrement stock quantity
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(stock_quantity - p_quantity, 0)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get products with low stock
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM products
  WHERE stock_quantity <= low_stock_threshold
  AND is_active = true
  ORDER BY stock_quantity ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
