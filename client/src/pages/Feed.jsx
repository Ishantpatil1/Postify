import { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { Loader, Sparkles, TrendingUp } from 'lucide-react';
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
    toast.success('🎉 Post created successfully!');
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    toast.success('✨ Post updated successfully!');
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
    toast.success('🗑️ Post deleted successfully!');
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
      {/* Header Section */}
      <div className="mb-6 text-center animate-fadeIn">
        <h1 className="text-4xl font-extrabold gradient-text mb-2 flex items-center justify-center gap-2">
          <TrendingUp className="h-8 w-8 text-purple-600" />
          Feed
        </h1>
        <p className="text-gray-600 text-lg">Share your thoughts with the world</p>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Posts Feed */}
      <div className="mt-6 space-y-6">
        {loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <div className="relative">
              <Loader className="h-12 w-12 text-purple-600 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 border-4 border-purple-200 rounded-full animate-ping"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading amazing posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="card text-center py-16 animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-lg">Be the first to share something amazing!</p>
          </div>
        ) : (
          <>
            {posts.map((post, index) => (
              <div key={post._id} style={{animationDelay: `${index * 0.1}s`}}>
                <PostCard
                  post={post}
                  currentUserId={user?.id}
                  onUpdate={handlePostUpdated}
                  onDelete={handlePostDeleted}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center py-8 animate-fadeIn">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Posts'
                  )}
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
