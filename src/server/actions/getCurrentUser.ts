'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCurrentUser() {
  const token = cookies().get('payload-token')
  if (!token) return null
  
  const payload = await getPayload({ config })
  
  try {
    const { user } = await payload.auth({
      headers: {
        cookie: `payload-token=${token.value}`,
      },
    })
    
    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}