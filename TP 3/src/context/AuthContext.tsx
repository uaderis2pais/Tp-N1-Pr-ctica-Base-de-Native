import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isPasswordRecovery: boolean
  pendingEmail: string | null
  setPendingEmail: (email: string | null) => void
  setIsPasswordRecovery: (value: boolean) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  // Función helper para procesar la URL entrante del deep link (ibanktp:// o exp://)
  const processDeepLinkUrl = async (url: string | null) => {
    if (!url) return

    try {
      const lowerUrl = url.toLowerCase()
      const isRecoveryUrl =
        lowerUrl.includes('reset-password') ||
        lowerUrl.includes('type=recovery') ||
        lowerUrl.includes('recovery')

      if (isRecoveryUrl) {
        setIsPasswordRecovery(true)
      }

      const hashOrQuery = url.split('#')[1] || url.split('?')[1]
      if (hashOrQuery) {
        const params = new URLSearchParams(hashOrQuery)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')
        const code = params.get('code')

        if (type === 'recovery') {
          setIsPasswordRecovery(true)
        }

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
        } else if (code) {
          await supabase.auth.exchangeCodeForSession(code)
        }
      }
    } catch (error) {
      console.warn('Error al procesar Deep Link URL:', error)
    }
  }

  useEffect(() => {
    let isMounted = true

    // 1. Obtener la URL inicial si la app fue abierta desde un enlace profundo
    Linking.getInitialURL().then((url) => {
      if (isMounted && url) {
        processDeepLinkUrl(url)
      }
    })

    // 2. Escuchar nuevos eventos de URL mientras la app está ejecutándose
    const subscriptionLinking = Linking.addEventListener('url', (event) => {
      if (isMounted && event.url) {
        processDeepLinkUrl(event.url)
      }
    })

    // 3. Obtener la sesión inicial persistida
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    })

    // 4. Escuchar cambios de estado de autenticación de Supabase
    const { data: authSubscription } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (isMounted) {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true)
        } else if (event === 'SIGNED_IN' && !isPasswordRecovery) {
          setIsPasswordRecovery(false)
        } else if (event === 'SIGNED_OUT') {
          setIsPasswordRecovery(false)
        }

        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscriptionLinking.remove()
      authSubscription.subscription.unsubscribe()
    }
  }, [isPasswordRecovery])

  const signOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setIsPasswordRecovery(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isPasswordRecovery,
        pendingEmail,
        setPendingEmail,
        setIsPasswordRecovery,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}
