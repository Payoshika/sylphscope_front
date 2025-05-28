import type { User } from "../types/user";

export type TokenStorage = "localStorage" | "sessionStorage" | "memory";

// Update TokenManager to store user info
class TokenManager {
  private storage: TokenStorage;
  private memoryStorage: Map<string, string> = new Map();

  constructor(storage: TokenStorage = "localStorage") {
    this.storage = storage;
  }

  private getStorage(): Storage | Map<string, string> {
    switch (this.storage) {
      case "localStorage":
        return localStorage;
      case "sessionStorage":
        return sessionStorage;
      case "memory":
        return this.memoryStorage;
      default:
        return localStorage;
    }
  }

  // Store token
  setToken(token: string): void {
    const storage = this.getStorage();
    if (storage instanceof Map) {
      storage.set("auth_token", token);
    } else {
      storage.setItem("auth_token", token);
    }
  }

  // Store user info
  setUser(user: User): void {
    const storage = this.getStorage();
    const userJson = JSON.stringify(user);
    if (storage instanceof Map) {
      storage.set("user_info", userJson);
    } else {
      storage.setItem("user_info", userJson);
    }
  }

  // Get stored user info
  getUser(): User | null {
    const storage = this.getStorage();
    let userJson: string | null;

    if (storage instanceof Map) {
      userJson = storage.get("user_info") || null;
    } else {
      userJson = storage.getItem("user_info");
    }

    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }

  // Get token
  getToken(): string | null {
    const storage = this.getStorage();
    if (storage instanceof Map) {
      return storage.get("auth_token") || null;
    } else {
      return storage.getItem("auth_token");
    }
  }

  // Check if token exists
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Clear all tokens and user info
  clearAll(): void {
    const storage = this.getStorage();
    if (storage instanceof Map) {
      storage.delete("auth_token");
      storage.delete("user_info");
    } else {
      storage.removeItem("auth_token");
      storage.removeItem("user_info");
    }
  }

  // Change storage type
  changeStorage(newStorage: TokenStorage): void {
    const currentToken = this.getToken();
    const currentUser = this.getUser();
    this.clearAll();
    this.storage = newStorage;

    if (currentToken) {
      this.setToken(currentToken);
    }
    if (currentUser) {
      this.setUser(currentUser);
    }
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;
