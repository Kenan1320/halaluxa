
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

-- Create an RPC function to update user shop preference
CREATE OR REPLACE FUNCTION update_user_shop_preference(
  p_user_id UUID,
  p_shop_id UUID,
  p_is_following BOOLEAN,
  p_is_favorite BOOLEAN,
  p_is_main_shop BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- If this is being set as the main shop, unset any other main shop
  IF p_is_main_shop THEN
    UPDATE user_shop_preferences
    SET is_main_shop = FALSE
    WHERE user_id = p_user_id AND shop_id != p_shop_id;
  END IF;

  -- Update the preference
  UPDATE user_shop_preferences
  SET 
    is_following = p_is_following,
    is_favorite = p_is_favorite,
    is_main_shop = p_is_main_shop,
    updated_at = NOW()
  WHERE 
    user_id = p_user_id AND shop_id = p_shop_id;
END;
$$;

-- Create an RPC function to insert user shop preference
CREATE OR REPLACE FUNCTION insert_user_shop_preference(
  p_user_id UUID,
  p_shop_id UUID,
  p_is_following BOOLEAN,
  p_is_favorite BOOLEAN,
  p_is_main_shop BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- If this is being set as the main shop, unset any other main shop
  IF p_is_main_shop THEN
    UPDATE user_shop_preferences
    SET is_main_shop = FALSE
    WHERE user_id = p_user_id AND shop_id != p_shop_id;
  END IF;

  -- Insert the preference
  INSERT INTO user_shop_preferences (
    user_id,
    shop_id,
    is_following,
    is_favorite,
    is_main_shop
  ) VALUES (
    p_user_id,
    p_shop_id,
    p_is_following,
    p_is_favorite,
    p_is_main_shop
  );
END;
$$;
