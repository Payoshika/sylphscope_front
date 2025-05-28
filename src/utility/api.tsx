import { tokenManager } from "./TokenManager";

const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true",
};

interface ApiResponse<T = any> {
  data: T | null; // Allow null data
  success: boolean;
  message?: string;
}

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  skipAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = env.API_BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getStoredToken(): string | null {
    return tokenManager.getToken();
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const { method = "GET", headers = {}, body, skipAuth = false } = config;

    const requestHeaders = {
      ...this.defaultHeaders,
      ...(skipAuth ? {} : this.getAuthHeaders()),
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (env.DEBUG_MODE) {
        console.log(`API ${method} ${endpoint}:`, {
          request: body,
          response: data,
        });
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      if (env.DEBUG_MODE) {
        console.error(`API ${method} ${endpoint} error:`, error);
      }

      return {
        data: null,
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // HTTP Methods
  async get<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    config?: { headers?: Record<string, string>; skipAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      headers: config?.headers,
      skipAuth: config?.skipAuth,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type { ApiResponse, RequestConfig };
