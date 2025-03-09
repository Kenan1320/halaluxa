
-- Create an RPC function to get user shop preferences with shop details
CREATE OR REPLACE FUNCTION get_user_shop_preferences(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  shop_id UUID,
  is_following BOOLEAN,
  is_favorite BOOLEAN,
  is_main_shop BOOLEAN,
  shop JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    usp.id,
    usp.user_id,
    usp.shop_id,
    usp.is_following,
    usp.is_favorite,
    usp.is_main_shop,
    jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'description', s.description,
      'category', s.category,
      'logo_url', s.logo_url
    ) AS shop
  FROM 
    user_shop_preferences usp
  JOIN 
    shops s ON usp.shop_id = s.id
  WHERE 
    usp.user_id = user_id_param;
END;
$$;
