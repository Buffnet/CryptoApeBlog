interface PostsListProps {
  posts: any[]
}

export default function PostsList({ posts }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-500 text-center">No posts yet. Create your first post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-2">
            By: {post.owner?.name || post.owner?.email || 'Unknown'}
          </p>
          {post.categories && post.categories.length > 0 && (
            <div className="mb-2">
              <span className="text-sm text-gray-500">Categories: </span>
              {post.categories.map((cat: any, index: number) => (
                <span key={cat.id} className="text-sm text-blue-600">
                  {cat.title}
                  {index < post.categories.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}
          <div className="text-gray-700">
            {post.content?.root?.children?.[0]?.children?.[0]?.text || 'No content'}
          </div>
        </div>
      ))}
    </div>
  )
}