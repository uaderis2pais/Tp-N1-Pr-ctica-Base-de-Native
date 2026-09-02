import React from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'

export default function Index() {
  const { session } = useAuth()

  if (session) {
    return <Redirect href="/(app)/home" />
  }

  return <Redirect href="/(auth)/login" />
}
