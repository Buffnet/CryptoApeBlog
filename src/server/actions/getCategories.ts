'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCategories() {
  const payload = await getPayload({ config })
  
  try {
    const categories = await payload.find({
      collection: 'categories',
      sort: 'title',
    })
    
    return categories
  } catch (error) {
    console.error('Get categories error:', error)
    return { docs: [] }
  }
}