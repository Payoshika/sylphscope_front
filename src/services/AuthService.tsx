import { apiClient, type ApiResponse } from "../utility/api";
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
      const response = await apiClient.post<LoginResponse>(
        `${this.BASE_PATH}/login`,
        credentials,
        { skipAuth: true }
      );

      if (response.success && response.data) {
        // Store both token and user info
        tokenManager.setToken(response.data.accessToken);
        tokenManager.setUser(response.data.user);

        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: {
              user: response.data.user,
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
        tokenManager.setToken(response.data.accessToken);

        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: {
              user: response.data.user,
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

  // Logout - clears tokens and optionally notifies backend
  static async logout(): Promise<void> {
    try {
      // Optionally notify backend
      await apiClient.post<void>(`${this.BASE_PATH}/logout`);
    } catch (error) {
      console.warn("⚠️ Logout API failed, but clearing tokens locally");
    } finally {
      // Always clear tokens and emit event
      tokenManager.clearAll();
      window.dispatchEvent(new CustomEvent("auth:logout"));
      console.log("✅ Logout completed");
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return tokenManager.hasToken();
  }

  // Get current user info (from API) - FIXED ENDPOINT
  // static async getCurrentUser(): Promise<ApiResponse<User>> {
  //   if (!this.isAuthenticated()) {
  //     return {
  //       data: null,
  //       success: false,
  //       message: "Not authenticated",
  //     };
  //   }
  //   // Fixed: removed duplicate path segments
  //   return apiClient.get<User>(`${this.BASE_PATH}/me`);
  // }

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

  // Validate current session
  static async validateSession(): Promise<boolean> {
    //   if (!this.isAuthenticated()) {
    //     return false;
    //   }

    //   try {
    //     const response = await this.getCurrentUser();
    //     return response.success && response.data !== null;
    //   } catch (error) {
    //     console.error("❌ Session validation failed:", error);
    //     this.forceLogout();
    //     return false;
    //   }
    // }
    return this.isAuthenticated();
  }
}

export default AuthService;
export type { AuthEventDetail };
