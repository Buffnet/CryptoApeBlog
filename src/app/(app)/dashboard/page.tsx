import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/server/actions/getCurrentUser'
import { getPosts } from '@/server/actions/getPosts'
import { getCategories } from '@/server/actions/getCategories'
import PostForm from '@/components/PostForm'
import PostsList from '@/components/PostsList'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const postsData = await getPosts()
  const categoriesData = await getCategories()
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Здравствуйте, {user.name || user.email}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
          <PostForm categories={categoriesData.docs} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          <PostsList posts={postsData.docs} />
        </div>
      </div>
    </div>
  )
}