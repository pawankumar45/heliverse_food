'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'manager':
          router.push('/dashboard/manager')
          break
        case 'pantry':
          router.push('/dashboard/pantry')
          break
        case 'delivery':
          router.push('/dashboard/delivery')
          break
        default:
          router.push('/login')
      }
    }
  }, [user, router])

  return null
}

