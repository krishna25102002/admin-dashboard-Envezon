const API_BASE_URL = 'http://codizone.in'

// Key for storing the token in localStorage
const AUTH_TOKEN_KEY = 'adminAuthToken';

/**
 * Stores the authentication token in localStorage.
 * IMPORTANT: localStorage is vulnerable to XSS attacks. For production,
 * consider more secure alternatives like HttpOnly cookies or managing tokens in memory.
 * @param {string} token - The authentication token.
 */
export const storeAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string|null} The token, or null if not found.
 */
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Removes the authentication token from localStorage (e.g., on logout).
 */
export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * A helper function to make fetch requests with common headers (like Authorization).
 * @param {string} endpoint - The API endpoint (e.g., '/user/count').
 * @param {object} options - Fetch options (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the response is not OK.
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken(); // Retrieve the dynamically stored token

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Allow overriding or adding headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    // Attempt to parse error message from response body if available
    let errorDetail = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorDetail += `, message: ${errorData.message}`;
      } else if (errorData) {
         errorDetail += `, details: ${JSON.stringify(errorData)}`;
      }
    } catch (parseError) {
      // Ignore JSON parsing error if response body is not JSON
      errorDetail += `, statusText: ${response.statusText}`;
    }
    throw new Error(`${errorDetail} for ${endpoint}`);
  }

  // Handle cases where the API might return 204 No Content
  if (response.status === 204) {
      return null;
  }

  return response.json();
};

// --- User Management ---

export const getUserCount = async () => {
  const data = await apiFetch('/user/count');
  return data.count !== undefined ? data.count : data; // Adjust based on your API response structure (e.g., { count: 123 } or just 123)
};

export const getAllUsers = async () => {
  return await apiFetch('/user/all'); // Assumes the API returns an array of users directly
};

// --- Business Partner Management ---

export const getBusinessPartnerCount = async () => {
  const data = await apiFetch('/business-partner/count');
  return data.count !== undefined ? data.count : data; // Adjust based on your API response structure
};

export const getAllBusinessPartners = async () => {
  return await apiFetch('/business-partner/all'); // Assumes the API returns an array of business partners directly
};

export const updateBusinessPartner = async (updateData) => {
  return await apiFetch('/business-partner', { method: 'PUT', body: JSON.stringify(updateData) });
};

// --- Promotions Management ---

export const getAllPromotions = async () => {
  return await apiFetch('/promotions/all'); // Assumes the API returns an array of promotions directly
};

export const addPromotion = async (promotionData) => {
  return await apiFetch('/promotions/add', { method: 'POST', body: JSON.stringify(promotionData) });
};