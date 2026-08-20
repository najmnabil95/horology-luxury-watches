import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://')
);

// Initialize client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ==========================================
// SUPABASE DATA SERVICE LAYER (CRUD & REALTIME)
// ==========================================

export const supabaseService = {
  // Check connection status
  isConfigured: () => isSupabaseConfigured,

  // ------------------------------------------
  // PRODUCTS
  // ------------------------------------------
  async getProducts() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[Supabase] Error fetching products:', err.message);
      return null;
    }
  },

  async upsertProduct(product) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert([product])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      console.error('[Supabase] Error saving product:', err.message);
      return null;
    }
  },

  async deleteProduct(productId) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error deleting product:', err.message);
      return false;
    }
  },

  // ------------------------------------------
  // ORDERS
  // ------------------------------------------
  async getOrders() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[Supabase] Error fetching orders:', err.message);
      return null;
    }
  },

  async createOrder(order) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      console.error('[Supabase] Error placing order:', err.message);
      return null;
    }
  },

  async updateOrderStatus(orderId, status) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error updating order status:', err.message);
      return false;
    }
  },

  // ------------------------------------------
  // APPOINTMENTS
  // ------------------------------------------
  async getAppointments() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[Supabase] Error fetching appointments:', err.message);
      return null;
    }
  },

  async createAppointment(appointment) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      console.error('[Supabase] Error booking appointment:', err.message);
      return null;
    }
  },

  async updateAppointmentStatus(appointmentId, status) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error updating appointment:', err.message);
      return false;
    }
  },

  // ------------------------------------------
  // REVIEWS
  // ------------------------------------------
  async getReviews() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[Supabase] Error fetching reviews:', err.message);
      return null;
    }
  },

  async createReview(review) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      console.error('[Supabase] Error submitting review:', err.message);
      return null;
    }
  },

  async updateReviewStatus(reviewId, status) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error updating review status:', err.message);
      return false;
    }
  },

  async deleteReview(reviewId) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error deleting review:', err.message);
      return false;
    }
  },

  // ------------------------------------------
  // ACTIVITY LOGS
  // ------------------------------------------
  async logActivity(action, details, user = 'VIP Client') {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{ action, details, user_name: user, created_at: new Date().toISOString() }]);

      if (error) throw error;
      return data;
    } catch (err) {
      // Activity logging error can fail silently
      return null;
    }
  },

  // ------------------------------------------
  // REALTIME SUBSCRIPTIONS
  // ------------------------------------------
  subscribeToChanges(table, onInsert, onUpdate, onDelete) {
    if (!supabase) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table },
        (payload) => onInsert && onInsert(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table },
        (payload) => onUpdate && onUpdate(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table },
        (payload) => onDelete && onDelete(payload.old)
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
};
