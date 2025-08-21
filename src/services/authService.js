class AuthService {
  constructor() {
    this.apiBaseUrl = '/api';
    this.token = localStorage.getItem('authToken');
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  // Sign up new user (demo implementation)
  async signUp({ email, password, fullName, role = 'viewer' }) {
    throw new Error('Sign up not available in demo mode. Please use demo credentials.');
  }

  // Sign in with email and password
  async signIn({ email, password }) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      return { user: data.user, session: { access_token: data.token } };
    } catch (error) {
      throw new Error(`Sign in failed: ${error?.message}`);
    }
  }

  // Sign out current user
  async signOut() {
    try {
      await fetch(`${this.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      // Clear local storage
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      return { success: true };
    } catch (error) {
      // Even if server call fails, clear local data
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return { success: true };
    }
  }

  // Get current session
  async getSession() {
    try {
      if (!this.token) return null;
      
      const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
          this.token = null;
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
        }
        return null;
      }

      const data = await response.json();
      return { 
        access_token: this.token,
        user: data.user
      };
    } catch (error) {
      console.error('Session check failed:', error);
      return null;
    }
  }

  // Get current user
  async getUser() {
    try {
      const session = await this.getSession();
      return session?.user || null;
    } catch (error) {
      throw new Error(`Get user failed: ${error?.message}`);
    }
  }

  // Get user profile 
  async getUserProfile(userId) {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return {
          id: user.id,
          user_id: user.id,
          display_name: user.name,
          role: user.role,
          department: user.role === 'admin' ? 'IT Administration' : 'General',
          language_preference: 'en'
        };
      }
      return null;
    } catch (error) {
      throw new Error(`Get user profile failed: ${error?.message}`);
    }
  }

  // Create or update user profile (demo)
  async upsertUserProfile(profileData) {
    // In demo mode, just return the profile data
    return profileData;
  }

  // Update user profile (demo)
  async updateUserProfile(userId, updateData) {
    // In demo mode, just return the updated data
    return { ...updateData, user_id: userId };
  }

  // Reset password (demo)
  async resetPassword(email) {
    throw new Error('Password reset not available in demo mode');
  }

  // Update password (demo)
  async updatePassword(newPassword) {
    throw new Error('Password update not available in demo mode');
  }

  // SSO Login (demo)
  async signInWithOAuth(provider) {
    throw new Error('OAuth not available in demo mode');
  }

  // Check if user has specific role
  async hasRole(userId, requiredRole) {
    const user = await this.getUser();
    return user?.role === requiredRole;
  }

  // Get user roles
  async getUserRoles(userId) {
    const user = await this.getUser();
    return user?.role ? [user.role] : [];
  }

  // Add role to user (demo)
  async addUserRole(userId, role) {
    throw new Error('Role management not available in demo mode');
  }

  // Remove role from user (demo)
  async removeUserRole(userId, role) {
    throw new Error('Role management not available in demo mode');
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    // Simple implementation for demo
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('currentUser');
      if (token && user) {
        callback({ 
          event: 'SIGNED_IN', 
          session: { access_token: token, user: JSON.parse(user) } 
        });
      } else {
        callback({ event: 'SIGNED_OUT', session: null });
      }
    };

    // Check immediately
    checkAuth();

    // Return cleanup function
    return { unsubscribe: () => {} };
  }
}

export const authService = new AuthService();
export default authService;