import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { AppState, Platform } from 'react-native'

// Adaptador de almacenamiento multiplataforma seguro para React Native, Web y SSR
const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key)
      }
      return null
    }
    return AsyncStorage.getItem(key)
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value)
      }
      return
    }
    return AsyncStorage.setItem(key, value)
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key)
      }
      return
    }
    return AsyncStorage.removeItem(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://iwjkpmmwjvnthgiepzyt.supabase.co'
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3amtwbW13anZudGhnaWVwenl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODU3ODgsImV4cCI6MjEwMzc2MTc4OH0.eTm1am_ozxcx6tf9KnQ-ulxbfkoayroE60bKIZbdYAw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native / Expo maneja los deep links con expo-linking
  },
})

// Escuchador del ciclo de vida para refresco automático de sesión
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
