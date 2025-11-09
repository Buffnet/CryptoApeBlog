import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Check if test user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'test@test.com',
        },
      },
    })
    
    if (existingUsers.docs.length > 0) {
      // Also check if categories exist
      const existingCategories = await payload.find({
        collection: 'categories',
        limit: 1,
      })
      
      if (existingCategories.docs.length > 0) {
        return NextResponse.json({ 
          message: 'Test user and categories already exist',
          email: 'test@test.com'
        })
      }
      
      return NextResponse.json({ 
        message: 'Test user already exists',
        email: 'test@test.com'
      })
    }
    
    // Create test user
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test@test.com',
        password: 'test',
        name: 'test',
      },
    })
    
    // Create sample categories
    const categories = [
      { title: 'Technology', slug: 'technology', description: 'Technology related posts' },
      { title: 'Crypto', slug: 'crypto', description: 'Cryptocurrency and blockchain posts' },
      { title: 'Web Development', slug: 'web-dev', description: 'Web development tutorials and tips' },
      { title: 'AI & Machine Learning', slug: 'ai-ml', description: 'Artificial Intelligence and ML topics' },
      { title: 'Security', slug: 'security', description: 'Cybersecurity and data protection' },
    ]
    
    for (const cat of categories) {
      await payload.create({
        collection: 'categories',
        data: {
          title: cat.title,
          slug: cat.slug,
          content: {
            root: {
              children: [{ 
                children: [{ text: cat.description }], 
                type: 'paragraph',
                version: 1,
                format: '',
                indent: 0,
                direction: 'ltr'
              }],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
          owner: testUser.id,
        },
      })
    }
    
    return NextResponse.json({ 
      message: 'Test user and categories created successfully',
      email: 'test@test.com',
      password: 'test',
      categories: categories.map(c => c.title)
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ error: 'Failed to initialize' }, { status: 500 })
  }
}