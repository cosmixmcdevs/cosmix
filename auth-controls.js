(function () {
  const STORAGE_KEY = 'cosmix-profile-users';
  const CURRENT_USER_KEY = 'cosmix-profile-current-user';
  const SUPABASE_SESSION_KEY = 'cosmix-supabase-session';

  function normalizeUser(user) {
    const normalized = user || {};
    return {
      id: normalized.id || '',
      username: String(normalized.username || '').trim() || 'Profile',
      email: String(normalized.email || '').trim().toLowerCase(),
      password: String(normalized.password || ''),
      avatar: normalized.avatar || '',
      role: normalized.role || 'member',
      roles: Array.isArray(normalized.roles) ? normalized.roles : [],
      permissions: Array.isArray(normalized.permissions) ? normalized.permissions : [],
      deleteRequested: Boolean(normalized.deleteRequested),
      deleteReason: normalized.deleteReason || '',
    };
  }

  // Get current user from Supabase session or fallback to localStorage
  function getCurrentUser() {
    try {
      // First try Supabase session
      const supabaseSession = localStorage.getItem(SUPABASE_SESSION_KEY);
      if (supabaseSession) {
        const session = JSON.parse(supabaseSession);
        if (session && session.user) {
          return normalizeUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            avatar: session.user.user_metadata?.avatar || '',
            role: session.user.user_metadata?.role || 'member',
            roles: session.user.user_metadata?.roles || [],
            permissions: session.user.user_metadata?.permissions || [],
          });
        }
      }

      // Fallback to localStorage user
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? normalizeUser(JSON.parse(raw)) : null;
    } catch (error) {
      return null;
    }
  }

  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SUPABASE_SESSION_KEY);
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizeUser(user)));
      // If Supabase session exists, also store it
      if (window.SupabaseAuth) {
        window.SupabaseAuth.getSession().then(session => {
          if (session) {
            localStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(session));
          }
        }).catch(err => console.error('Error storing Supabase session:', err));
      }
    } else {
      clearCurrentUser();
    }
  }

  function getStoredUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function renderAuthControls() {
    const containers = document.querySelectorAll('.auth-controls');
    const currentUser = getCurrentUser();

    containers.forEach((container) => {
      if (!container) return;

      if (currentUser) {
        const roles = Array.isArray(currentUser.roles) ? currentUser.roles : [];
        const isOwner = roles.includes('owner') || currentUser.role === 'owner' || currentUser.isOwner;
        const isStaff = isOwner || currentUser.role === 'staff' || currentUser.role === 'admin' || roles.includes('staff') || roles.includes('admin');
        const extraLinks = isStaff
          ? '<a class="button secondary small" href="staff.html">Staff</a><a class="button secondary small" href="reports.html">Reports</a>'
          : '';
        const ownerUsersLink = isOwner ? '<a class="button secondary small" href="owner-users.html">Owner users</a>' : '';
        container.innerHTML = `<a class="button secondary small" href="/profile.html">${currentUser.username || 'Profile'}</a>${extraLinks}${ownerUsersLink}<button class="button secondary small" id="signout-button" type="button">Sign out</button>`;
        const signoutButton = container.querySelector('#signout-button');
        if (signoutButton) {
          signoutButton.addEventListener('click', () => {
            // Sign out from Supabase if available
            if (window.SupabaseAuth) {
              window.SupabaseAuth.signOut().catch(err => console.error('Error signing out:', err));
            }
            clearCurrentUser();
            renderAuthControls();
          });
        }
      } else {
        const profileHref = window.location.pathname.includes('/eaglercraft/') ? '../profile.html' : '/profile.html';
        const rootHref = window.location.pathname.includes('/eaglercraft/') ? '../profile.html?view=signup' : '/profile.html?view=signup';
        container.innerHTML = `<a class="button secondary small" href="${profileHref}">Sign in</a><a class="button secondary small" href="${rootHref}">Sign up</a>`;
      }
    });
  }

  // Listen to Supabase auth state changes
  function setupSupabaseAuthListener() {
    if (window.SupabaseAuth && window.SupabaseAuth.onAuthStateChange) {
      window.SupabaseAuth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          setCurrentUser(session.user);
          renderAuthControls();
        } else {
          clearCurrentUser();
          renderAuthControls();
        }
      });
    }
  }

  window.renderAuthControls = renderAuthControls;
  window.setCurrentUser = setCurrentUser;
  window.getCurrentUser = getCurrentUser;
  window.clearCurrentUser = clearCurrentUser;

  window.addEventListener('load', () => {
    renderAuthControls();
    setupSupabaseAuthListener();
  });
  window.addEventListener('storage', renderAuthControls);
  document.addEventListener('DOMContentLoaded', () => {
    renderAuthControls();
    setupSupabaseAuthListener();
  });
})();
