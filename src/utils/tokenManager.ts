// Secure token management utility
// Note: For full security, tokens should be stored in httpOnly cookies on the server side
// This is a client-side improvement with better security practices

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'at';
  private static readonly REFRESH_TOKEN_KEY = 'rt';
  private static readonly EXPIRES_AT_KEY = 'eat';
  
  // Use sessionStorage for more security (cleared on tab close)
  private static storage = window.sessionStorage;

  static setTokens(accessToken: string, refreshToken: string, expiresIn: number = 3600): void {
    try {
      const expiresAt = Date.now() + (expiresIn * 1000);
      
      // Store tokens separately and encode them
      this.storage.setItem(this.ACCESS_TOKEN_KEY, btoa(accessToken));
      this.storage.setItem(this.REFRESH_TOKEN_KEY, btoa(refreshToken));
      this.storage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  static getAccessToken(): string | null {
    try {
      const token = this.storage.getItem(this.ACCESS_TOKEN_KEY);
      if (!token) return null;
      
      // Check if token is expired
      if (this.isTokenExpired()) {
        this.clearTokens();
        return null;
      }
      
      return atob(token);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  static getRefreshToken(): string | null {
    try {
      const token = this.storage.getItem(this.REFRESH_TOKEN_KEY);
      return token ? atob(token) : null;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  static isTokenExpired(): boolean {
    try {
      const expiresAt = this.storage.getItem(this.EXPIRES_AT_KEY);
      if (!expiresAt) return true;
      
      return Date.now() >= parseInt(expiresAt);
    } catch (error) {
      return true;
    }
  }

  static clearTokens(): void {
    try {
      this.storage.removeItem(this.ACCESS_TOKEN_KEY);
      this.storage.removeItem(this.REFRESH_TOKEN_KEY);
      this.storage.removeItem(this.EXPIRES_AT_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  static hasValidToken(): boolean {
    return this.getAccessToken() !== null;
  }

  // For backward compatibility with existing localStorage usage
  static migrateFromLocalStorage(): void {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        this.setTokens(accessToken, refreshToken);
        
        // Clean up old tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Failed to migrate tokens:', error);
    }
  }
}

export default TokenManager;