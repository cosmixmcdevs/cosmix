(function () {
  const CURRENT_USER_KEY = 'cosmix-profile-current-user';
  let currentUser = null;

  function normalizeUser(user) {
    const normalized = user || {};
    const metadata = normalized.user_metadata || {};
    const appMetadata = normalized.app_metadata || {};
    return {
      id: normalized.id || '',
      username: String(metadata.username || normalized.username || '').trim() || normalized.email?.split('@')[0] || 'Profile',
      email: String(normalized.email || '').trim().toLowerCase(),
      avatar: metadata.avatar || '',
      role: appMetadata.role || 'member',
      roles: Array.isArray(appMetadata.roles) ? appMetadata.roles : [],
      permissions: Array.isArray(appMetadata.permissions) ? appMetadata.permissions : [],
      deleteRequested: Boolean(metadata.deleteRequested),
      deleteReason: metadata.deleteReason || '',
    };
  }

  function getCurrentUser() {
    return currentUser;
  }

  function clearCurrentUser() {
    currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new CustomEvent('cosmix-auth-state-changed'));
  }

  function setCurrentUser(user, notify = true) {
    if (user) {
      currentUser = normalizeUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      clearCurrentUser();
    }
    if (notify) window.dispatchEvent(new CustomEvent('cosmix-auth-state-changed'));
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
          signoutButton.addEventListener('click', async () => {
            signoutButton.disabled = true;
            try {
              await window.SupabaseAuth.signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              signoutButton.disabled = false;
            }
          });
        }
      } else {
        const profileHref = window.location.pathname.includes('/eaglercraft/') ? '../profile.html' : '/profile.html';
        const rootHref = window.location.pathname.includes('/eaglercraft/') ? '../profile.html?view=signup' : '/profile.html?view=signup';
        container.innerHTML = `<a class="button secondary small" href="${profileHref}">Sign in</a><a class="button secondary small" href="${rootHref}">Sign up</a>`;
      }
    });
  }

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${source}`));
      document.head.appendChild(script);
    });
  }

  async function initializeSupabaseAuth() {
    await loadScript('/supabase-public-config.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0/dist/umd/supabase.js');
    await loadScript('/supabase-client.js');

    window.SupabaseAuth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null, event !== 'TOKEN_REFRESHED');
      renderAuthControls();
    });

    const session = await window.SupabaseAuth.getSession();
    setCurrentUser(session?.user || null);
    renderAuthControls();
    return true;
  }

  window.renderAuthControls = renderAuthControls;
  window.setCurrentUser = setCurrentUser;
  window.getCurrentUser = getCurrentUser;
  window.clearCurrentUser = clearCurrentUser;
  window.setCurrentUser = setCurrentUser;
  window.renderAuthControls = renderAuthControls;
  window.SupabaseAuthReady = initializeSupabaseAuth().catch((error) => {
    console.error('Supabase authentication could not start:', error);
    renderAuthControls();
    return false;
  });
  renderAuthControls();
})();
