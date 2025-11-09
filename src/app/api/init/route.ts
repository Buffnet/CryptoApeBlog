import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const results = {
      userCreated: false,
      userExists: false,
      categoriesCreated: [] as string[],
      categoriesExisted: [] as string[],
    }
    
    // Check if test user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'test@test.com',
        },
      },
    })
    
    let testUser
    if (existingUsers.docs.length > 0) {
      testUser = existingUsers.docs[0]
      results.userExists = true
    } else {
      // Create test user
      testUser = await payload.create({
        collection: 'users',
        data: {
          email: 'test@test.com',
          password: 'test',
          name: 'test',
        },
      })
      results.userCreated = true
    }
    
    // Create sample categories
    const categories = [
      { title: 'Technology', slug: 'technology', description: 'Technology related posts' },
      { title: 'Crypto', slug: 'crypto', description: 'Cryptocurrency and blockchain posts' },
      { title: 'Web Development', slug: 'web-dev', description: 'Web development tutorials and tips' },
      { title: 'AI & Machine Learning', slug: 'ai-ml', description: 'Artificial Intelligence and ML topics' },
      { title: 'Security', slug: 'security', description: 'Cybersecurity and data protection' },
    ]
    
    for (const cat of categories) {
      // Check if category already exists
      const existingCat = await payload.find({
        collection: 'categories',
        where: {
          slug: {
            equals: cat.slug,
          },
        },
      })
      
      if (existingCat.docs.length === 0) {
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
        results.categoriesCreated.push(cat.title)
      } else {
        results.categoriesExisted.push(cat.title)
      }
    }
    
    // Build response message
    let message = ''
    if (results.userCreated) {
      message += 'Test user created. '
    } else {
      message += 'Test user already exists. '
    }
    
    if (results.categoriesCreated.length > 0) {
      message += `Created ${results.categoriesCreated.length} new categories. `
    }
    
    if (results.categoriesExisted.length > 0) {
      message += `${results.categoriesExisted.length} categories already existed. `
    }
    
    return NextResponse.json({ 
      message: message.trim(),
      email: 'test@test.com',
      password: results.userCreated ? 'test' : 'existing user',
      categoriesCreated: results.categoriesCreated,
      categoriesExisted: results.categoriesExisted,
      allCategories: categories.map(c => c.title)
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ error: 'Failed to initialize' }, { status: 500 })
  }
}