// c:\Users\kd1812\Desktop\admin-dashboard-Envezon\src\services\apiService.js

// This would be your actual base URL for the API
const API_BASE_URL = "https://codizone.in";

// A generic fetch wrapper (optional, but good practice)
const apiFetch = async (endpoint, options = {}, method = null) => {
  const { body, ...customConfig } = options;
  const headers = { "Content-Type": "application/json" };

  // Retrieve token for authenticated requests
  const token = getAuthToken(); // Assuming getAuthToken is defined in this file
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Adjust if your auth scheme is different
  }

  const config = {
    method: method ? method : body ? customConfig.method || "POST" : "GET",
    ...customConfig, // Spread the rest of the options, excluding body
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body && typeof body === "object") {
    // Ensure body is stringified if it's an object
    config.body = JSON.stringify(body);
  } else if (body) {
    config.body = body;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const error = new Error(
        errorData.message || `API Error: ${response.status} - ${response.url}`
      );
      error.response = response;
      error.data = errorData;
      throw error;
    }
    if (response.status === 204) {
      // Handle No Content response
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(
      `API Fetch Error (${config.method} ${API_BASE_URL}${endpoint}):`,
      error.data || error.message
    );
    throw error; // Re-throw to be caught by the component
  }
};

export const getBusinessDetailsById = async (id) => {
  // Ensure this path is correct. Examples:
  // '/business-partner/${id}'
  // '/api/business-partner/${id}'
  // '/business-partners/${id}' (plural)
  const endpointPath = `/business-partner/all`; // <--- VERIFY THIS PATH WITH POSTMAN
  const fullUrl = `${API_BASE_URL}${endpointPath}`;

  console.log(
    "Attempting to fetch business details from (apiService.js):",
    fullUrl
  );

  const token = localStorage.getItem("authToken"); // Or however you get your token
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, { headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status} at ${response.url}`,
    }));
    throw new Error(
      errorData.message || `API Error: ${response.status} - ${response.url}`
    );
  }
  return response.json();
};

export const updateBusinessDetailsAPI = async (id, data) => {
  // Ensure this path is correct for updates.
  const endpointPath = `/business-partner/`; // <--- VERIFY THIS PATH WITH POSTMAN
  const fullUrl = `${API_BASE_URL}${endpointPath}`;
  console.log(
    "Attempting to update business details at (apiService.js):",
    fullUrl
  );

  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: "PUT", // Or 'POST' or 'PATCH' depending on your API
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status} at ${response.url}`,
    }));
    throw new Error(
      errorData.message ||
        `Failed to update business details: ${response.status}`
    );
  }
  return response.json();
};

// Function to get all users
export const getAllUsers = async () => {
  console.log("Fetching all users from /user/all");
  return await apiFetch("/user/all"); // GET request
};

// Function for Dashboard: Get User Count
export const getUserCount = async () => {
  const responseData = await apiFetch("/user/count");
  console.log(
    "API Response for /user/count (from getUserCount):",
    responseData
  );
  // Check if responseData itself is the count, or if it's an object containing count
  if (typeof responseData === "number") {
    return responseData;
  } else if (responseData && typeof responseData.count === "number") {
    return responseData.count;
  }
  console.warn(
    "getUserCount received unexpected data format or error, defaulting to 0. Response:",
    responseData
  );
  return 0; // Fallback value
};

// Function for Dashboard: Get Business Partner Count
// Function for Dashboard: Get Business Partner Count
export const getBusinessPartnerCount = async () => {
  const responseData = await apiFetch("/business-partner/count");
  console.log(
    "API Response for /business-partner/count (from getBusinessPartnerCount):",
    responseData
  );
  // Check if responseData itself is the count, or if it's an object containing count
  if (typeof responseData === "number") {
    return responseData; // This will now correctly return 15 if responseData is 15
  } else if (responseData && typeof responseData.count === "number") {
    return responseData.count;
  }
  console.warn(
    "getBusinessPartnerCount received unexpected data format or error, defaulting to 0. Response:",
    responseData
  );
  return 0; // Fallback value
};
// Function to clear authentication token (example implementation)
export const clearAuthToken = () => {
  console.log("Clearing auth token from localStorage");
  // In a real application, you would clear the token from localStorage or sessionStorage
  localStorage.removeItem("authToken");
};

// Function to store authentication token (example implementation)
export const storeAuthToken = (token) => {
  console.log("Storing auth token in localStorage:", token);
  // In a real application, you would store the token in localStorage or sessionStorage
  localStorage.setItem("authToken", token);
};

// Function to get all business partners
export const getAllBusinessPartners = async () => {
  return await apiFetch("/business-partner/all"); // GET request
};

// Function to get authentication token (example implementation)
export const getAuthToken = () => {
  console.log("Getting auth token from localStorage");
  // In a real application, you would retrieve the token from localStorage or sessionStorage
  return localStorage.getItem("authToken");
  // return "simulated_auth_token_12345"; // Example token if not using localStorage yet
};
// Function to get all promotions
export const getAllPromotions = async () => {
  console.log("Fetching all promotions from /promotions/all");
  return await apiFetch("/promotions/all"); // GET request
};

// Function to add a new promotion
export const addPromotion = async (promotionData) => {
  console.log("Adding new promotion to /promotions/add");
  return await apiFetch("/promotions/add", {
    method: "POST",
    body: promotionData,
  });
};

export const deletePromotionById = async (promotionId) => {
  const response = await apiFetch(
    `/promotions/delete/${promotionId}`,
    {},
    "DELETE"
  );
  return response;
};
