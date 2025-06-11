import { createClient } from '@supabase/supabase-js'

// Get environment variables with safe defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if we have valid Supabase configuration
const hasValidConfig = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''

// Create a comprehensive mock client for development/build when env vars are missing
const createMockClient = () => ({
  from: (table: string) => ({
    select: (columns?: string) => ({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK'
    }),
    insert: (values: any) => ({
      data: [],
      error: null,
      count: 0,
      status: 201,
      statusText: 'Created'
    }),
    update: (values: any) => ({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK'
    }),
    delete: () => ({
      data: [],
      error: null,
      count: 0,
      status: 204,
      statusText: 'No Content'
    }),
    order: (column: string, options?: any) => ({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK'
    }),
    limit: (count: number) => ({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK'
    }),
    eq: (column: string, value: any) => ({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK'
    }),
    single: () => ({
      data: null,
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK'
    })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null })
    })
  }
})

// Export either real client or mock client based on environment
let supabaseClient: any

try {
  if (hasValidConfig) {
    // Only create real client if we have valid configuration
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    // Use mock client during build or when env vars are missing
    console.log('Supabase environment variables not found, using mock client')
    supabaseClient = createMockClient()
  }
} catch (error) {
  // Fallback to mock client if there's any error during initialization
  console.warn('Failed to initialize Supabase client, using mock client:', error)
  supabaseClient = createMockClient()
}

export const supabase = supabaseClient

// Export the configuration for easy access
export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : '', // Mask the key for security
  project: 'Muscat Bay Assets & Operations',
  isConfigured: hasValidConfig
} as const

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return hasValidConfig
}

// Helper to get connection status
export const getSupabaseStatus = () => {
  return {
    connected: hasValidConfig,
    url: supabaseUrl ? 'Configured' : 'Missing',
    key: supabaseAnonKey ? 'Configured' : 'Missing',
    client: hasValidConfig ? 'Real Supabase Client' : 'Mock Client'
  }
}
