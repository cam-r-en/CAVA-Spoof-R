// API base URL - update this when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Menu API calls
export const menuAPI = {
  // Get all menu items
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return response.json();
  },

  // Get menu items by category
  getByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/menu?category=${category}`);
    if (!response.ok) throw new Error(`Failed to fetch ${category} items`);
    return response.json();
  },

  // Get single menu item
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);
    if (!response.ok) throw new Error('Failed to fetch menu item');
    return response.json();
  },
};

// Orders API calls
export const ordersAPI = {
  // Create new order
  create: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }
    return response.json();
  },

  // Get all orders
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Get order by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },
};

// Cart API calls
export const cartAPI = {
  // Get cart for session
  get: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  // Save/update cart
  save: async (sessionId, items) => {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save cart');
    }
    return response.json();
  },

  // Clear cart
  clear: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  },
};
