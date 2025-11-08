import { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await postAPI.getPosts({ page, limit: 10 });
      
      if (page === 1) {
        setPosts(data.data);
      } else {
        setPosts(prev => [...prev, ...data.data]);
      }
      
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    toast.success('Post created successfully!');
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    toast.success('Post updated successfully!');
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
    toast.success('Post deleted successfully!');
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await postAPI.likePost(postId);
      setPosts(posts.map(p => p._id === postId ? data.data : p));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (postId, updatedPost) => {
    setPosts(posts.map(p => p._id === postId ? updatedPost : p));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Posts Feed */}
      <div className="mt-6 space-y-6">
        {loading && page === 1 ? (
          <div className="flex justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <>
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?.id}
                onUpdate={handlePostUpdated}
                onDelete={handlePostDeleted}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
