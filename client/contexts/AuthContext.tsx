'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name: string
  role: 'manager' | 'pantry' | 'delivery'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: { name: string; email: string; password: string; role: string; phone: string; address: string }) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      if (pathname == '/register') return;

      try {
        const response = await axios.get('/auth/validate-token')

        if (response.status === 200) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.error(error);
        router.push('/login')
      }
    }

    validateToken()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/login', { email, password })

      if (response.status === 200) {
        setUser(response.data.user)
        router.push('/dashboard')
      }
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/auth/logout');

      if (response.status === 200) {
        setUser(null)
        router.push('/login')
        toast.success("Logout successfully")
      }
    } catch (error) {
      toast.error("Logout Failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role: string; phone: string, address: string }) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/register', userData)

      return response.data
    } catch (error) {
      throw new Error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

