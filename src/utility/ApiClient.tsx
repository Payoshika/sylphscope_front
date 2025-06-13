import { tokenManager } from "./TokenManager";

const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true",
};

interface ApiResponse<T = any> {
  data: T | null;
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

    if (env.DEBUG_MODE) {
      console.log("🔧 API Client initialized with base URL:", this.baseURL);
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getStoredToken();

    if (env.DEBUG_MODE) {
      if (token) {
        console.log("🔑 Token found - length:", token.length);
        console.log(
          "🔑 Token format check:",
          token.includes(".") ? "JWT format" : "NOT JWT format"
        );
        console.log("🔑 Token preview:", token.substring(0, 50) + "...");
      } else {
        console.log("⚠️ No token found for authenticated request");
      }
    }

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

    const authHeaders = skipAuth ? {} : this.getAuthHeaders();
    const requestHeaders = {
      ...this.defaultHeaders,
      ...authHeaders,
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        // Handle 403 MFA required specifically
        if (
          response.status === 403 &&
          errorData.message === "MFA verification required"
        ) {
          return {
            data: null,
            success: false,
            message: "MFA verification required",
          };
        }
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (env.DEBUG_MODE) {
        console.log(`✅ API Response: ${method} ${endpoint}`, data);
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      if (env.DEBUG_MODE) {
        console.error(`❌ API Error: ${method} ${endpoint}`, error);
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
