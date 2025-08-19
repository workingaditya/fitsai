import { supabase } from '../lib/supabase';

class AuthService {
  // Sign up new user
  async signUp({ email, password, fullName, role = 'viewer' }) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Sign up failed: ${error?.message}`);
    }
  }

  // Sign in with email and password
  async signIn({ email, password }) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Sign in failed: ${error?.message}`);
    }
  }

  // Sign out current user
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Sign out failed: ${error?.message}`);
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      throw new Error(`Get session failed: ${error?.message}`);
    }
  }

  // Get current user
  async getUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      throw new Error(`Get user failed: ${error?.message}`);
    }
  }

  // Get user profile from public.profiles table
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('profiles')?.select(`
          id,
          user_id,
          display_name,
          role,
          department,
          language_preference,
          created_at,
          updated_at
        `)?.eq('user_id', userId)?.single();

      if (error) {
        // If no profile exists, return null instead of throwing error
        if (error?.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      throw new Error(`Get user profile failed: ${error?.message}`);
    }
  }

  // Create or update user profile
  async upsertUserProfile(profileData) {
    try {
      const { data, error } = await supabase?.from('profiles')?.upsert(profileData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Upsert user profile failed: ${error?.message}`);
    }
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      const { data, error } = await supabase?.from('profiles')?.update(updateData)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Update user profile failed: ${error?.message}`);
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window?.location?.origin}/reset-password`
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Reset password failed: ${error?.message}`);
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase?.auth?.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Update password failed: ${error?.message}`);
    }
  }

  // SSO Login with OAuth providers
  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window?.location?.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`OAuth sign in failed: ${error?.message}`);
    }
  }

  // Check if user has specific role
  async hasRole(userId, requiredRole) {
    try {
      const { data, error } = await supabase?.from('user_roles')?.select('role')?.eq('user_id', userId)?.eq('role', requiredRole)?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }
      
      return !!data;
    } catch (error) {
      throw new Error(`Check role failed: ${error?.message}`);
    }
  }

  // Get user roles
  async getUserRoles(userId) {
    try {
      const { data, error } = await supabase?.from('user_roles')?.select('role')?.eq('user_id', userId);

      if (error) throw error;
      return data?.map(row => row?.role) || [];
    } catch (error) {
      throw new Error(`Get user roles failed: ${error?.message}`);
    }
  }

  // Add role to user
  async addUserRole(userId, role) {
    try {
      const { data, error } = await supabase?.from('user_roles')?.insert({
          user_id: userId,
          role
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Add user role failed: ${error?.message}`);
    }
  }

  // Remove role from user
  async removeUserRole(userId, role) {
    try {
      const { error } = await supabase?.from('user_roles')?.delete()?.eq('user_id', userId)?.eq('role', role);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Remove user role failed: ${error?.message}`);
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase?.auth?.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
export default authService;