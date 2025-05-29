import { apiClient, type ApiResponse } from "../utility/ApiClient";
import { tokenManager } from "../utility/TokenManager";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";
import type { User } from "../types/user";

interface AuthEventDetail {
  user: User;
  timestamp: number;
}

class AuthService {
  private static readonly BASE_PATH = "/api/public";

  // Login - gets token from API and stores it
  static async login(
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log("🚀 Starting login process...");

      const response = await apiClient.post<LoginResponse>(
        `${this.BASE_PATH}/login`,
        credentials,
        { skipAuth: true }
      );
      console.log("📥 Backend response:", response);

      if (response.success && response.data) {
        console.log("✅ Login successful, processing response...");
        // Check the response structure
        console.log("🔍 Response data structure:", {
          token: response.data.token ? "✅ Present" : "❌ Missing",
          type: response.data.type,
          id: response.data.id,
          username: response.data.username,
          roles: response.data.roles,
        });

        // Store token (note: using 'token' not 'accessToken')
        if (response.data.token) {
          console.log("🔑 Storing authentication token...");
          console.log("🎫 Token length:", response.data.token.length);
          console.log(
            "🎫 Token preview:",
            response.data.token.substring(0, 50) + "..."
          );

          tokenManager.setToken(response.data.token);
        } else {
          console.error("❌ No token in response");
          return {
            data: null,
            success: false,
            message: "No token received from server",
          };
        }

        // Create user object from the response
        const user: User = {
          id: parseInt(response.data.id), // Convert string to number if needed
          username: response.data.username,
          email: "", // Not provided in JwtResponse, might need to get from elsewhere
          roles: response.data.roles,
        };

        console.log("👤 Created user object:", user);
        tokenManager.setUser(user);

        // Verify storage
        const storedToken = tokenManager.getToken();
        const storedUser = tokenManager.getUser();

        // Emit login event
        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: {
              user,
              timestamp: Date.now(),
            },
          })
        );

        console.log("✅ Authentication successful");
      }

      return response;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  }

  // Get current user from storage (not API)
  static getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return tokenManager.getUser();
  }

  // Register - similar to login
  static async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.BASE_PATH}/signup`,
        userData,
        { skipAuth: true }
      );

      if (response.success && response.data) {
        // Store token (note: using 'token' not 'accessToken')
        tokenManager.setToken(response.data.token);

        // Create user object from the response
        const user: User = {
          id: parseInt(response.data.id),
          username: response.data.username,
          email: "", // Not provided in JwtResponse
          roles: response.data.roles,
        };

        tokenManager.setUser(user);

        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: {
              user,
              timestamp: Date.now(),
            },
          })
        );

        console.log("✅ Registration successful");
      }

      return response;
    } catch (error) {
      console.error("❌ Registration failed:", error);
      throw error;
    }
  }

  // Logout - clears token
  static async logout(): Promise<void> {
    // Always clear tokens and emit event
    tokenManager.clearAll();
    window.dispatchEvent(new CustomEvent("auth:logout"));
    console.log("✅ Logout completed");
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return tokenManager.hasToken();
  }

  // Get stored token
  static getToken(): string | null {
    return tokenManager.getToken();
  }

  // Force logout (clear tokens without API call)
  static forceLogout(): void {
    tokenManager.clearAll();
    window.dispatchEvent(new CustomEvent("auth:logout"));
    console.log("🔒 Force logout completed");
  }

  // Validate current session with better error handling
  static async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.log("ℹ️ No token found, user not authenticated");
      return false;
    }

    try {
      console.log("🔍 Validating session with backend...");

      const response = await apiClient.get<User>(
        `${this.BASE_PATH}/validate-token`
      );

      if (response.success && response.data) {
        // Update stored user info with fresh data from server
        tokenManager.setUser(response.data);
        console.log("✅ Token is valid, user authenticated");
        return true;
      } else {
        // Token is invalid - clear it and force logout
        console.warn("❌ Token validation failed:", response.message);
        console.log("🧹 Clearing invalid token from storage");
        this.forceLogout();
        return false;
      }
    } catch (error) {
      // Network error or other issues - also clear invalid token
      console.error("❌ Token validation failed:", error);
      console.log("🧹 Clearing potentially invalid token from storage");
      this.forceLogout();
      return false;
    }
  }

  // Initialize auth and clean up invalid tokens
  static async initializeAuth(): Promise<void> {
    if (!this.isAuthenticated()) {
      console.log("ℹ️ No stored token found");
      return;
    }

    console.log("🔄 Checking stored token validity...");
    const isValid = await this.validateSession();

    if (!isValid) {
      console.log("🧹 Removed invalid token during initialization");
    }
  }
}

export default AuthService;
export type { AuthEventDetail };
