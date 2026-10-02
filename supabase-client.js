(function () {
  let client;

  function getClient() {
    if (client) return client;

    const config = window.COSMIX_SUPABASE_CONFIG || {};
    if (!config.url || !config.anonKey || !window.supabase?.createClient) {
      throw new Error('Supabase Auth is unavailable. Check the public project config and try again.');
    }

    client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    return client;
  }

  function unwrap(result) {
    if (result.error) throw result.error;
    return result.data;
  }

  window.SupabaseAuth = {
    async signUp(email, password, userData = {}) {
      return unwrap(await getClient().auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/profile.html`,
        },
      }));
    },

    async signIn(email, password) {
      return unwrap(await getClient().auth.signInWithPassword({ email, password }));
    },

    async signOut() {
      unwrap(await getClient().auth.signOut());
    },

    async getSession() {
      return unwrap(await getClient().auth.getSession()).session;
    },

    async getUser() {
      return unwrap(await getClient().auth.getUser()).user;
    },

    async updateUser(updates) {
      return unwrap(await getClient().auth.updateUser(updates));
    },

    async resetPassword(email) {
      unwrap(await getClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile.html?view=recovery`,
      }));
    },

    onAuthStateChange(callback) {
      return getClient().auth.onAuthStateChange(callback);
    },
  };
})();
