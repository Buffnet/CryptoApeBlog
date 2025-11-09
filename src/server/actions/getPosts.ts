'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getPosts() {
  const payload = await getPayload({ config })
  
  try {
    const posts = await payload.find({
      collection: 'posts',
      depth: 2,
      sort: '-createdAt',
    })
    
    return posts
  } catch (error) {
    console.error('Get posts error:', error)
    return { docs: [] }
  }
}