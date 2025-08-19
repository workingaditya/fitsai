import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userRoles, setUserRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Demo auth mode: bypass Supabase for local testing and demos
  const isDemoAuth =
    import.meta?.env?.VITE_DEMO_AUTH === 'true' ||
    (import.meta?.env?.VITE_SUPABASE_URL?.includes?.('example.supabase.co') &&
     import.meta?.env?.VITE_SUPABASE_ANON_KEY === 'public-anon-key')

  const persistDemoState = (state) => {
    try { localStorage?.setItem('demo_auth_state', JSON.stringify(state)) } catch {}
  }
  const loadDemoState = () => {
    try { return JSON.parse(localStorage?.getItem('demo_auth_state') || 'null') } catch { return null }
  }
  const clearDemoState = () => {
    try { localStorage?.removeItem('demo_auth_state') } catch {}
  }

  useEffect(() => {
    if (isDemoAuth) {
      const saved = loadDemoState()
      if (saved?.user) {
        setUser(saved?.user)
        setUserProfile(saved?.userProfile)
        setUserRoles(saved?.userRoles || [])
      }
      setLoading(false)
      return
    }

    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session?.user)
        fetchUserProfile(session?.user?.id)
      }
      setLoading(false)
    })

    // Listen for auth changes - NEVER ASYNC callback
    const listener = supabase?.auth?.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session?.user)
        fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
      } else {
        setUser(null)
        setUserProfile(null)
        setUserRoles([])
      }
      setLoading(false)
    })

    return () => listener?.data?.subscription?.unsubscribe?.()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      setError('')
      
      // Fetch user profile
      const profile = await authService?.getUserProfile(userId)
      setUserProfile(profile)
      
      // Fetch user roles
      const roles = await authService?.getUserRoles(userId)
      setUserRoles(roles)
      
    } catch (err) {
      // Don't set error for profile fetch failures - user might not have profile yet
      console.log('Profile fetch failed:', err?.message)
    }
  }

  const signUp = async ({ email, password, fullName, role = 'viewer' }) => {
    try {
      setLoading(true)
      setError('')
      
      if (isDemoAuth) {
        // Demo mode: create a local account
        const demoUser = { id: `demo_${Date.now()}`, email }
        const profile = { user_id: demoUser.id, display_name: fullName || email?.split?.('@')?.[0], role }
        setUser(demoUser)
        setUserProfile(profile)
        setUserRoles([role])
        persistDemoState({ user: demoUser, userProfile: profile, userRoles: [role] })
        return { user: demoUser }
      }

      const result = await authService?.signUp({ email, password, fullName, role })
      
      if (result?.user && !result?.session) {
        // Email confirmation required
        setError('Please check your email and click the confirmation link to complete your registration.')
      }
      
      return result
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
      } else {
        setError(err?.message)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async ({ email, password }) => {
    try {
      setLoading(true)
      setError('')
      
      // Always bypass Supabase when using known demo credentials OR when demo mode is enabled
      const allowed = {
        'admin@company.com': { role: 'admin', password: 'Admin123!' },
        'support@company.com': { role: 'sme', password: 'Support123!' },
        'security@company.com': { role: 'admin', password: 'Security123!' },
        'employee@company.com': { role: 'viewer', password: 'Employee123!' },
      }
      const emailKey = email?.toLowerCase?.()
      const demoEntry = allowed[emailKey]
      const isDemoCreds = Boolean(demoEntry && (!password || demoEntry.password === password))

      if (isDemoAuth || isDemoCreds) {
        const role = demoEntry?.role || 'viewer'
        const demoUser = { id: `demo_${Date.now()}`, email }
        const profile = { user_id: demoUser.id, display_name: email?.split?.('@')?.[0], role }
        setUser(demoUser)
        setUserProfile(profile)
        setUserRoles([role])
        persistDemoState({ user: demoUser, userProfile: profile, userRoles: [role] })
        return { user: demoUser }
      }

      const result = await authService?.signIn({ email, password })
      return result
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
      } else {
        setError(err?.message)
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (isDemoAuth) {
        clearDemoState()
        setUser(null)
        setUserProfile(null)
        setUserRoles([])
        return
      }

      await authService?.signOut()
      setUser(null)
      setUserProfile(null)
      setUserRoles([])
    } catch (err) {
      setError(err?.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider) => {
    try {
      setLoading(true)
      setError('')
      
      // Check if provider is supported in the current Supabase configuration
      if (!['google', 'github', 'apple', 'azure', 'bitbucket', 'discord', 'facebook', 'figma', 'gitlab', 'kakao', 'keycloak', 'linkedin', 'notion', 'slack', 'spotify', 'twitch', 'twitter', 'workos', 'zoom']?.includes(provider)) {
        throw new Error(`Provider "${provider}" is not supported or configured in your Supabase project. Please configure it in your Supabase dashboard or use email/password authentication.`)
      }
      
      const result = await authService?.signInWithOAuth(provider)
      return result
    } catch (err) {
      let errorMessage = err?.message
      
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        errorMessage = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
      } else if (err?.message?.includes('Unsupported provider') || 
                 err?.message?.includes('could not be found')) {
        errorMessage = `Authentication provider "${provider}" is not configured in your Supabase project. Please configure it in the Authentication settings or use email/password login for the demo.`
      }
      
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updateData) => {
    try {
      setError('')
      
      if (!user?.id) {
        throw new Error('No user logged in')
      }
      
      const updatedProfile = await authService?.updateUserProfile(user?.id, updateData)
      setUserProfile(updatedProfile)
      
      return updatedProfile
    } catch (err) {
      setError(err?.message)
      throw err
    }
  }

  const resetPassword = async (email) => {
    try {
      setError('')
      
      const result = await authService?.resetPassword(email)
      return result
    } catch (err) {
      setError(err?.message)
      throw err
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      setError('')
      
      const result = await authService?.updatePassword(newPassword)
      return result
    } catch (err) {
      setError(err?.message)
      throw err
    }
  }

  // Helper functions
  const hasRole = (requiredRole) => {
    return userRoles?.includes(requiredRole) || userProfile?.role === requiredRole
  }

  const isAdmin = () => {
    return hasRole('admin') || userProfile?.role === 'admin'
  }

  const isEmployee = () => {
    return hasRole('viewer') || userProfile?.role === 'viewer' || hasRole('sme') || userProfile?.role === 'sme'
  }

  const isSupport = () => {
    return hasRole('sme') || userProfile?.role === 'sme'
  }

  const clearError = () => {
    setError('')
  }

  const value = {
    user,
    userProfile,
    userRoles,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    updateProfile,
    resetPassword,
    updatePassword,
    hasRole,
    isAdmin,
    isEmployee,
    isSupport,
    clearError,
    refreshProfile: () => fetchUserProfile(user?.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}