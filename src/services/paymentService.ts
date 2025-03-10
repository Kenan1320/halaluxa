
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

// Define payment-related types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account';
  provider: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  shopId: string;
  shopName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  pickupType?: 'in_store' | 'curbside';
  vehicleColor?: string;
  pickupStatus?: 'pending' | 'arriving' | 'arrived' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  paymentMethodId?: string;
  createdAt: string;
}

// Helper to map database order to our model
const mapDbOrderToModel = (data: any): Order => {
  return {
    id: data.id,
    userId: data.user_id,
    shopId: data.shop_id,
    shopName: data.shop_name,
    items: data.items || [],
    totalAmount: data.total_amount,
    status: data.status,
    paymentStatus: data.payment_status,
    pickupType: data.pickup_type,
    vehicleColor: data.vehicle_color,
    pickupStatus: data.pickup_status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Helper to convert our model to database fields
const prepareOrderForDb = (order: Partial<Order>) => {
  const dbOrder: Record<string, any> = {
    user_id: order.userId,
    shop_id: order.shopId,
    shop_name: order.shopName,
    items: order.items,
    total_amount: order.totalAmount,
    status: order.status,
    payment_status: order.paymentStatus,
    pickup_type: order.pickupType,
    vehicle_color: order.vehicleColor,
    pickup_status: order.pickupStatus,
  };
  
  if (order.id) {
    dbOrder.id = order.id;
  }
  
  return dbOrder;
};

// Create a new order
export async function createOrder(order: Partial<Order>): Promise<Order | null> {
  try {
    const dbOrder = prepareOrderForDb(order);
    
    const { data, error } = await supabase
      .from('orders')
      .insert(dbOrder)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return null;
    }
    
    // Notify the business owner about the new order
    if (data && data.shop_id) {
      try {
        await supabase
          .from('business_notifications')
          .insert({
            business_id: data.shop_id,
            order_id: data.id,
            type: 'new_order',
            title: 'New Order Received',
            message: `You have received a new order for $${data.total_amount.toFixed(2)}`,
            metadata: { orderId: data.id }
          });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the whole transaction if just the notification fails
      }
    }
    
    return mapDbOrderToModel(data);
  } catch (err) {
    console.error('Error in createOrder:', err);
    return null;
  }
}

// Update an order
export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const dbUpdates: Record<string, any> = {};
    
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
    if (updates.pickupType !== undefined) dbUpdates.pickup_type = updates.pickupType;
    if (updates.vehicleColor !== undefined) dbUpdates.vehicle_color = updates.vehicleColor;
    if (updates.pickupStatus !== undefined) dbUpdates.pickup_status = updates.pickupStatus;
    
    const { data, error } = await supabase
      .from('orders')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      return null;
    }
    
    return mapDbOrderToModel(data);
  } catch (err) {
    console.error('Error in updateOrder:', err);
    return null;
  }
}

// Get an order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching order:', error);
      return null;
    }
    
    return mapDbOrderToModel(data);
  } catch (err) {
    console.error('Error in getOrderById:', err);
    return null;
  }
}

// Get all orders for a user
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
    
    return data.map(mapDbOrderToModel);
  } catch (err) {
    console.error('Error in getOrdersByUser:', err);
    return [];
  }
}

// Get all orders for a shop
export async function getOrdersByShop(shopId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop orders:', error);
      return [];
    }
    
    return data.map(mapDbOrderToModel);
  } catch (err) {
    console.error('Error in getOrdersByShop:', err);
    return [];
  }
}

// Create a payment intent
export async function createPaymentIntent(
  userId: string,
  orderId: string,
  amount: number
): Promise<PaymentIntent | null> {
  try {
    const { data, error } = await supabase
      .from('payment_intents')
      .insert({
        user_id: userId,
        order_id: orderId,
        amount,
        currency: 'usd',
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      orderId: data.order_id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paymentMethodId: data.payment_method_id,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('Error in createPaymentIntent:', err);
    return null;
  }
}

// Update payment status
export async function updatePaymentStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'failed' | 'refunded'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updatePaymentStatus:', err);
    return false;
  }
}

// Get notifications for a business
export async function getBusinessNotifications(businessId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('business_notifications')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching business notifications:', error);
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Error in getBusinessNotifications:', err);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('business_notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in markNotificationAsRead:', err);
    return false;
  }
}

// Update pickup status
export async function updatePickupStatus(
  orderId: string,
  status: 'pending' | 'arriving' | 'arrived' | 'completed' | 'cancelled',
  vehicleColor?: string
): Promise<boolean> {
  try {
    const updates: Record<string, any> = { pickup_status: status };
    
    if (vehicleColor) {
      updates.vehicle_color = vehicleColor;
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating pickup status:', error);
      return false;
    }
    
    // Notify business owner of arriving customer
    if (status === 'arriving') {
      try {
        const { data: orderData } = await supabase
          .from('orders')
          .select('shop_id')
          .eq('id', orderId)
          .single();
        
        if (orderData && orderData.shop_id) {
          await supabase
            .from('business_notifications')
            .insert({
              business_id: orderData.shop_id,
              order_id: orderId,
              type: 'customer_arriving',
              title: 'Customer Arriving Soon',
              message: `A customer will arrive for pickup in 2 minutes${vehicleColor ? ` in a ${vehicleColor} car` : ''}`,
              metadata: { orderId, vehicleColor }
            });
        }
      } catch (notificationError) {
        console.error('Error creating arrival notification:', notificationError);
        // Don't fail the whole transaction if just the notification fails
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error in updatePickupStatus:', err);
    return false;
  }
}

// Mock function for testing
export function getMockOrders(): Order[] {
  return [
    {
      id: "order1",
      userId: "user1",
      shopId: "shop1",
      shopName: "Halal Delights",
      items: [
        {
          productId: "prod1",
          productName: "Halal Beef Burger Patties",
          quantity: 2,
          price: 12.99,
          totalPrice: 25.98
        }
      ],
      totalAmount: 25.98,
      status: "pending",
      paymentStatus: "pending",
      pickupType: "in_store",
      pickupStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
