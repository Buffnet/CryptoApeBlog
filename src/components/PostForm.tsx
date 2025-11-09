'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/server/actions/createPost'

interface PostFormProps {
  categories: any[]
}

export default function PostForm({ categories }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    categories: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.categories.length === 0) {
      setError('Please select at least one category')
      return
    }
    
    setLoading(true)

    try {
      const result = await createPost({
        ...formData,
        content: {
          root: {
            children: [
              {
                children: [{ text: formData.content }],
                type: 'paragraph',
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        },
      })

      if (result.success) {
        setFormData({ title: '', slug: '', content: '', categories: [] })
        router.refresh()
      } else {
        setError(result.error || 'Failed to create post')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => {
            setFormData({
              ...formData,
              title: e.target.value,
              slug: generateSlug(e.target.value),
            })
          }}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Categories
        </label>
        <div className="border rounded p-3 max-h-40 overflow-y-auto">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                value={category.id}
                checked={formData.categories.includes(category.id)}
                onChange={(e) => {
                  const categoryId = e.target.value
                  if (e.target.checked) {
                    setFormData({ 
                      ...formData, 
                      categories: [...formData.categories, categoryId] 
                    })
                  } else {
                    setFormData({ 
                      ...formData, 
                      categories: formData.categories.filter(id => id !== categoryId) 
                    })
                  }
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-700">{category.title}</span>
            </label>
          ))}
        </div>
        {formData.categories.length === 0 && (
          <p className="text-xs text-red-500 mt-1">Please select at least one category</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={6}
          required
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}