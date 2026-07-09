export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Combine options, ensuring cookies are sent for auth
  const fetchOptions: RequestInit = {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // If FormData, remove Content-Type so browser sets it with boundary
  if (options.body instanceof FormData) {
    const headers = new Headers(fetchOptions.headers);
    headers.delete("Content-Type");
    fetchOptions.headers = headers;
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(`Invalid response from server. Make sure VITE_API_BASE_URL is configured correctly.`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error?.message || "API Error");
    }
    
    return result.data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Public API
export const getProducts = (params?: Record<string, any>) => {
  const query = params ? new URLSearchParams(params).toString() : "";
  return apiFetch(`/products${query ? `?${query}` : ""}`);
};
export const getProduct = (id: string) => apiFetch(`/products/${id}`);
export const getCategories = () => apiFetch(`/categories`);
export const getOffers = () => apiFetch(`/offers`);
export const getSettings = () => apiFetch(`/settings`);
export const logOrder = (data: any) => apiFetch(`/order-log`, { method: "POST", body: JSON.stringify(data) });

// Admin API
export const adminLogin = (credentials: any) => apiFetch(`/admin/login`, { method: "POST", body: JSON.stringify(credentials) });
export const adminLogout = () => apiFetch(`/admin/logout`, { method: "POST" });
export const getAdminMe = () => apiFetch(`/admin/me`);

// Products
export const createProduct = (data: any) => apiFetch(`/products`, { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id: string, data: any) => apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id: string) => apiFetch(`/products/${id}`, { method: "DELETE" });

// Offers
export const createOffer = (data: any) => apiFetch(`/offers`, { method: "POST", body: JSON.stringify(data) });
export const updateOffer = (id: string, data: any) => apiFetch(`/offers/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteOffer = (id: string) => apiFetch(`/offers/${id}`, { method: "DELETE" });

// Settings
export const updateSettings = (data: any) => apiFetch(`/settings`, { method: "PUT", body: JSON.stringify(data) });

// Upload
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch(`/upload`, { method: "POST", body: formData });
};
