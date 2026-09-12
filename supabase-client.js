// Supabase client-side initialization
// This file provides authentication functions for the browser

(function () {
  // These values will be populated from the server
  window.SUPABASE_CONFIG = {
    url: null,
    anonKey: null,
  };

  // Initialize Supabase client
  function initializeSupabase() {
    if (!window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.anonKey) {
      console.error('Supabase configuration not loaded');
      return null;
    }

    if (window.supabase && window.supabase.createClient) {
      return window.supabase.createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
          },
        }
      );
    }
    return null;
  }

  // Export functions
  window.SupabaseAuth = {
    // Sign up with email and password
    async signUp(email, password, userData = {}) {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      return data;
    },

    // Sign in with email and password
    async signIn(email, password) {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },

    // Sign out
    async signOut() {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    // Get current session
    async getSession() {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },

    // Get current user
    async getUser() {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },

    // Update user profile
    async updateProfile(updates) {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;
      return data;
    },

    // Reset password
    async resetPassword(email) {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password.html',
      });

      if (error) throw error;
    },

    // Update password
    async updatePassword(newPassword) {
      const supabase = initializeSupabase();
      if (!supabase) throw new Error('Supabase not initialized');

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },

    // Listen to auth changes
    onAuthStateChange(callback) {
      const supabase = initializeSupabase();
      if (!supabase) {
        console.error('Supabase not initialized');
        return;
      }

      return supabase.auth.onAuthStateChange(callback);
    },
  };

  // Load Supabase config from server
  async function loadSupabaseConfig() {
    try {
      const response = await fetch('/api/supabase-config');
      if (response.ok) {
        const config = await response.json();
        window.SUPABASE_CONFIG.url = config.url;
        window.SUPABASE_CONFIG.anonKey = config.anonKey;
      }
    } catch (error) {
      console.error('Failed to load Supabase config:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSupabaseConfig);
  } else {
    loadSupabaseConfig();
  }
})();
