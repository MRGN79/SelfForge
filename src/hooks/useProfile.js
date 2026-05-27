import { useState, useCallback } from 'react'
import { getProfile, saveProfile } from '../storage.js'

export function useProfile() {
  const [profile, setProfile] = useState(() => getProfile())

  const updateProfile = useCallback((data) => {
    setProfile(prev => {
      const next = { ...prev, ...data }
      saveProfile(next)
      return next
    })
  }, [])

  return { profile, updateProfile }
}
