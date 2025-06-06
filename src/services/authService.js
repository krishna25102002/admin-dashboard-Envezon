// src/services/authService.js

import { storeAuthToken, clearAuthToken } from './apiService';

const API_BASE_URL = 'http://codizone.in'; // Ensure this is your correct API base URL

/**
 * Attempts to log in the admin user by sending credentials to the backend.
 * If successful, stores the received token.
 * @param {string} username - The admin's username.
 * @param {string} password - The admin's password.
 * @returns {Promise<string>} - The authentication token if login is successful.
 * @throws {Error} - If login fails or token is not received in the response.
 */
export async function loginAdmin(username, password) {
  try {
    // !!! IMPORTANT !!!
    // Replace '/admin/login' with the actual URL path
    // on your backend server that handles admin login requests.
    // This is the endpoint that will verify the username/password
    // and return a JWT token upon success.
    const loginEndpoint = `${API_BASE_URL}/admin/login`; // EXAMPLE: '/admin/login' or '/auth/token'

    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // !!! IMPORTANT !!!
      // Adjust the body structure (e.g., { username, password } or { phone, password })
      // to match what your backend login endpoint expects.
      // Sending 'phoneNumber' and 'otp' to align with your database schema.
      // The 'username' variable from the function argument will contain the phone number entered by the user.
      // The 'password' variable from the function argument will contain the OTP entered by the user.
      body: JSON.stringify({ phoneNumber: username, otp: password }),
    });

    if (!response.ok) {
      let errorDetail = `Login failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        errorDetail += `, StatusText: ${response.statusText}`;
      }
      throw new Error(errorDetail);
    }

    const data = await response.json();

    if (data && data.token) { // Adjust 'data.token' if your backend uses a different key
      storeAuthToken(data.token);
      return data.token;
    } else {
      throw new Error('Login successful, but token not found in response.');
    }
  } catch (error) {
    throw error; // Re-throw the error so the calling component can handle it
  }
}

/**
 * Logs out the admin user by clearing the stored token.
 */
export function logoutAdmin() {
  clearAuthToken();
  // You would typically redirect the user to the login page here
  // For example: window.location.href = '/login';
}