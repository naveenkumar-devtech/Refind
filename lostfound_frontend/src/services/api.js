import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const login = async (credentials) => {
  console.log('Login request data:', credentials);
  try {
    const response = await api.post('login/', credentials);
    setAuthToken(response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    let errorMessage = error.response?.data?.detail || 'Login failed';
    if (error.response?.status === 429) {
      const waitTime = error.response.data.detail?.match(/\d+/) || ['a few'];
      errorMessage = `Too many login attempts. Please try again in ${Math.ceil(waitTime[0] / 60)} minutes.`;
    }
    throw new Error(errorMessage);
  }
};

export const register = async (userData) => {
  console.log('Register request data:', userData);
  try {
    const response = await api.post('register/', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};

export const getProfile = async () => {
  console.log('Fetching profile');
  try {
    const response = await api.get('profile/');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch profile');
  }
};

export const getMyItems = async () => {
  console.log('Fetching my items');
  try {
    const response = await api.get('my-items/');
    return response.data;
  } catch (error) {
    console.error('Error fetching my items:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch items');
  }
};

export const getDashboardData = async () => {
  console.log('Fetching dashboard data');
  try {
    const response = await api.get('dashboard/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch dashboard data');
  }
};

export const getCategories = async () => {
  console.log('Fetching categories');
  try {
    const response = await api.get('categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch categories');
  }
};

export const reportItemApi = async (formData) => {
  console.log('Reporting item with data:', formData);
  try {
    const response = await api.post('items/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error reporting item:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to report item');
  }
};

export const getItemDetails = async (itemId) => {
  console.log(`Fetching item details for ID: ${itemId}`);
  if (!itemId || isNaN(itemId)) {
    console.error('Invalid item_id:', itemId);
    throw new Error('Item ID must be a valid number');
  }
  try {
    const response = await api.get(`view-item/${itemId}/`);
    return response.data;
  } catch (error) {
    console.error('API error:', {
      url: `view-item/${itemId}/`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.detail || 'Failed to fetch item details');
  }
};

export const claimItemApi = async (itemId, claimNote) => {
  console.log('Claiming item with ID:', itemId, 'Note:', claimNote);
  try {
    const response = await api.post(`claim/${itemId}/`, { claim_note: claimNote });
    return response.data;
  } catch (error) {
    console.error('Error claiming item:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to claim item');
  }
};

export const approveClaim = async (itemId) => {
  console.log('Approving claim for item:', itemId);
  try {
    const response = await api.post(`claim-approve/${itemId}/`);
    return response.data;
  } catch (error) {
    console.error('Error approving claim:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to approve claim');
  }
};

export const updateItemStatus = async (itemId, status) => {
  console.log(`Updating status for item ${itemId} to ${status}`);
  try {
    const response = await api.post(`items/${itemId}/status/`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${itemId} status:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to update item status');
  }
};

export const getChatMessages = async (itemId, receiverId) => {
  console.log('Fetching chat messages for item:', itemId, 'receiver:', receiverId);
  if (!itemId || !receiverId || isNaN(itemId) || isNaN(receiverId)) {
    console.error('Invalid parameters:', { itemId, receiverId });
    throw new Error('Missing or invalid itemId or receiverId');
  }
  try {
    const response = await api.get('chat/', {
      params: { item_id: itemId, receiver_id: receiverId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch chat messages');
  }
};

export const sendChatMessage = async (itemId, receiverId, message) => {
  console.log('Sending message for item:', itemId, 'to receiver:', receiverId, 'message:', message);
  const parsedItemId = parseInt(itemId);
  const parsedReceiverId = parseInt(receiverId);
  if (isNaN(parsedItemId) || isNaN(parsedReceiverId) || !message.trim()) {
    console.error('Invalid parameters:', { itemId, receiverId, message });
    throw new Error('Invalid item ID, receiver ID, or empty message');
  }
  try {
    const response = await api.post('messages/', {
      item: parsedItemId,
      receiver: parsedReceiverId,
      message: message.trim(),
    });
    console.log('Message response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      payload: { item: parsedItemId, receiver: parsedReceiverId, message },
    });
    let errorMessage = 'Failed to send message. Please try again.';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data) {
      errorMessage = Object.values(error.response.data).flat().join(' ');
    }
    throw new Error(errorMessage);
  }
};

export const getNotificationSummary = async () => {
  console.log('Fetching notification summary');
  try {
    const response = await api.get('notifications/summary/');
    return response.data;
  } catch (error) {
    console.error('Error fetching notification summary:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch notification summary');
  }
};

export const getNotifications = async (includeRead = false) => {
  console.log('Fetching notifications, includeRead:', includeRead);
  try {
    const response = await api.get(`notifications/?include_read=${includeRead}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching notifications:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch notifications');
  }
};

export const askChatbot = async (query) => {
  try {
    console.log('Sending chatbot query:', query);
    const response = await api.post('chat/support/', { query });
    return response.data;
  } catch (error) {
    console.error('Error communicating with chatbot:', error.response?.data || error);
    return { message: 'Sorry, the AI assistant is currently unavailable.' };
  }
};

export const getAIMatches = async ({ query, location }) => {
  console.log('Fetching AI matches for query:', query, 'location:', location);
  try {
    const response = await api.post('ai-matches/', { query, location });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI matches:', error.response?.data || error.message);
    let errorMessage = error.response?.data?.detail || 'Failed to fetch AI matches';
    if (error.response?.status === 429) {
      const waitTime = error.response.data.detail?.match(/\d+/) || ['a few'];
      errorMessage = `Too many requests. Please try again in ${Math.ceil(waitTime[0] / 60)} minutes.`;
    }
    throw new Error(errorMessage);
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/login/')) {
        console.error('Login failed:', error.response?.data);
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          console.error('No refresh token available');
          throw new Error('No refresh token available');
        }
        console.log('Attempting token refresh with:', refreshToken);
        const response = await api.post('token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        console.log('New access token:', access);
        setAuthToken(access);
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError);
        localStorage.clear();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    console.error('API error:', {
      url: originalRequest.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);