import { apiClient, type ApiResponse } from "../utility/ApiClient";
import { tokenManager } from "../utility/TokenManager";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";
import type {
  User,
  ProfileUpdateRequest,
  UpdateMfaRequest,
} from "../types/user";

interface AuthEventDetail {
  user: User;
  timestamp: number;
}

class AuthService {
  private static readonly BASE_PATH = "/api/public";
  private static readonly USER_PATH = "/api/user";

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

        // Store token
        if (response.data.token) {
          console.log("🔑 Storing authentication token...");
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
          id: parseInt(response.data.id),
          username: response.data.username,
          email: response.data.email || "",
          roles: response.data.roles,
          mfaEnabled: response.data.mfaEnabled,
        };
        console.log("👤 Created user object:", user);
        tokenManager.setUser(user);

        // Don't emit login event here - let validateSession handle it
        // This prevents premature state updates before MFA verification

        console.log("✅ Authentication token stored");
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

  // Update user profile
  static async updateProfile(
    profileData: ProfileUpdateRequest
  ): Promise<ApiResponse<User>> {
    try {
      console.log("🔄 Updating user profile...");
      const response = await apiClient.post<User>(
        `${this.USER_PATH}/update-profile`,
        profileData
      );
      return response;
    } catch (error) {
      console.error("❌ Profile update failed:", error);
      throw error;
    }
  }

  static async updateMfa(
    mfaData: UpdateMfaRequest
  ): Promise<ApiResponse<User>> {
    try {
      console.log("🔄 Updating MFA setting...");
      const response = await apiClient.post<User>(
        `${this.USER_PATH}/update-mfa`,
        mfaData
      );
      if (response.success && response.data) {
        console.log("✅ MFA setting updated successfully");
      }
      return response;
    } catch (error) {
      console.error("❌ MFA update failed:", error);
      throw error;
    }
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
  static async validateSession(): Promise<boolean | "mfa_required"> {
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
        // Check if it's an MFA requirement
        if (response.message === "MFA verification required") {
          console.log("🔐 MFA verification required");
          return "mfa_required";
        } else {
          // Token is invalid - clear it and force logout
          console.warn("❌ Token validation failed:", response.message);
          console.log("🧹 Clearing invalid token from storage");
          this.forceLogout();
          return false;
        }
      }
    } catch (error) {
      // Check if it's a 403 Forbidden error (MFA required)
      if (error instanceof Error && error.message.includes("403")) {
        console.log("🔐 MFA verification required (403 Forbidden)");
        return "mfa_required"; // Don't auto-request here
      }

      // Network error or other issues - also clear invalid token
      console.error("❌ Token validation failed:", error);
      console.log("🧹 Clearing potentially invalid token from storage");
      this.forceLogout();
      return false;
    }
  }

  static async requestMfaCode(): Promise<ApiResponse<any>> {
    try {
      console.log("📧 Requesting MFA verification code...");
      console.log(tokenManager.getUser());
      const response = await apiClient.post(
        `${this.BASE_PATH}/mfa/request`,
        { email: tokenManager.getUser()?.email },
        { skipAuth: true }
      );

      if (response.success) {
        console.log("✅ MFA code request sent successfully");
      }
      return response;
    } catch (error) {
      console.error("❌ MFA code request failed:", error);
      throw error;
    }
  }

  static async verifyMfaCode(
    code: string
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log("🔐 Verifying MFA code...");

      // Get the current user's email and token
      const currentUser = tokenManager.getUser();
      const currentToken = tokenManager.getToken();

      if (!currentUser?.email || !currentToken) {
        throw new Error("Missing user data or token for MFA verification");
      }

      const response = await apiClient.post<LoginResponse>(
        `${this.BASE_PATH}/mfa/verify`,
        {
          email: currentUser.email,
          code: code,
          token: currentToken,
        },
        { skipAuth: true } // Don't include auth header since we're sending token in body
      );

      if (response.success && response.data) {
        // Store the new MFA-verified token
        if (response.data.token) {
          console.log("🔑 Storing MFA-verified token...");
          tokenManager.setToken(response.data.token);
        }

        // Update user object with fresh data from response
        const user: User = {
          id: parseInt(response.data.id),
          username: response.data.username,
          email: response.data.email || "",
          roles: response.data.roles,
          mfaEnabled: true,
        };

        tokenManager.setUser(user);
        console.log("✅ MFA verification successful");

        // Emit login event
        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: { user, timestamp: Date.now() },
          })
        );
      }
      return response;
    } catch (error) {
      console.error("❌ MFA verification failed:", error);
      throw error;
    }
  }

  // Initialize auth and clean up invalid tokens
  static async initializeAuth(): Promise<
    "authenticated" | "mfa_required" | "unauthenticated"
  > {
    if (!this.isAuthenticated()) {
      console.log("ℹ️ No stored token found");
      return "unauthenticated";
    }

    console.log("🔄 Checking stored token validity...");
    const validationResult = await this.validateSession();

    if (validationResult === true) {
      return "authenticated";
    } else if (validationResult === "mfa_required") {
      return "mfa_required";
    } else {
      console.log("🧹 Removed invalid token during initialization");
      return "unauthenticated";
    }
  }
}

export default AuthService;
export type { AuthEventDetail };
