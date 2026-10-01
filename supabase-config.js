const { createClient } = require('@supabase/supabase-js');

const configuredSupabaseUrl = process.env.SUPABASE_URL || '';
const configuredAnonKey = process.env.SUPABASE_ANON_KEY || '';
const configuredServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseUrl = /^https?:\/\//i.test(configuredSupabaseUrl) && !configuredSupabaseUrl.includes('your_')
  ? configuredSupabaseUrl
  : '';
const supabaseAnonKey = supabaseUrl && configuredAnonKey && !configuredAnonKey.includes('your_')
  ? configuredAnonKey
  : '';
const supabaseServiceRoleKey = supabaseUrl && configuredServiceRoleKey && !configuredServiceRoleKey.includes('your_')
  ? configuredServiceRoleKey
  : '';

// Client for server-side operations with service role
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}) : null;

// Client for client operations
const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
}) : null;

module.exports = {
  supabaseAdmin,
  supabaseClient,
  supabaseUrl,
  supabaseAnonKey,
};
