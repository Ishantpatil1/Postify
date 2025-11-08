import { useState } from 'react';
import { postAPI, uploadAPI } from '../services/api';
import { Heart, MessageCircle, Trash2, Edit, Send, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const PostCard = ({ post, currentUserId, onUpdate, onDelete, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl || '');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isOwner = post.user?._id === currentUserId;
  const isLiked = post.likes?.includes(currentUserId);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setEditImageFile(file);
      setEditImageUrl('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview('');
    setEditImageUrl('');
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Content cannot be empty');
      return;
    }

    try {
      let finalImageUrl = post.imageUrl || '';

      if (editImageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', editImageFile);
        
        const uploadResponse = await uploadAPI.uploadImage(formData);
        finalImageUrl = `http://localhost:5000${uploadResponse.data.data.imageUrl}`;
        setUploadingImage(false);
      }

      const { data } = await postAPI.updatePost(post._id, {
        content: editContent.trim(),
        imageUrl: finalImageUrl || null
      });
      onUpdate(data.data);
      setIsEditing(false);
      removeEditImage();
      toast.success('✨ Post updated!');
    } catch (error) {
      toast.error('Failed to update post');
      setUploadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postAPI.deletePost(post._id);
        onDelete(post._id);
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleLikeClick = async () => {
    setIsLiking(true);
    await onLike(post._id);
    setTimeout(() => setIsLiking(false), 600);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data } = await postAPI.addComment(post._id, { content: commentText.trim() });
      onComment(post._id, data.data);
      setCommentText('');
      toast.success('💬 Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await postAPI.deleteComment(post._id, commentId);
      onComment(post._id, data.data);
      toast.success('Comment deleted!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="card group animate-fadeIn">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-purple-100 transform group-hover:scale-110 transition-all duration-300">
              {post.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{post.user?.name}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <Sparkles className="h-3 w-3 mr-1 text-purple-400" />
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md"
              title="Edit post"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md"
              title="Delete post"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-3 mb-4 animate-scaleIn">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-5 py-4 border-2 border-purple-300 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all duration-300"
            rows="3"
          />
          
          {(editImagePreview || (post.imageUrl && !editImageFile)) && (
            <div className="relative animate-scaleIn">
              <img 
                src={editImagePreview || post.imageUrl} 
                alt="Preview" 
                className="w-full max-h-80 rounded-2xl object-cover shadow-xl ring-4 ring-purple-100"
              />
              <button
                type="button"
                onClick={removeEditImage}
                className="absolute top-3 right-3 p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {!post.imageUrl && !editImagePreview && (
            <div className="flex items-center">
              <input
                type="file"
                id={`edit-image-${post._id}`}
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label
                htmlFor={`edit-image-${post._id}`}
                className="flex items-center space-x-2 px-5 py-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-300 cursor-pointer font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-sm">Add Photo</span>
              </label>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              disabled={uploadingImage}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {uploadingImage ? 'Uploading...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
                setEditImageUrl(post.imageUrl || '');
                removeEditImage();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 mb-4 whitespace-pre-wrap text-base leading-relaxed">{post.content}</p>
          {post.imageUrl && (
            <div className="relative overflow-hidden rounded-2xl mb-4 group/img">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full max-h-96 object-cover transition-transform duration-500 group-hover/img:scale-105"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
        </>
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-4 border-t-2 border-gray-100">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform ${
            isLiked 
              ? 'text-red-600 bg-red-50 scale-110' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50 hover:scale-110'
          } ${isLiking ? 'animate-pulse' : ''} shadow-md hover:shadow-lg`}
        >
          <Heart className={`h-5 w-5 transition-all duration-300 ${isLiked ? 'fill-current scale-125' : ''}`} />
          <span className="text-sm font-bold">{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-bold">{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t-2 border-gray-100 space-y-4 animate-slideIn">
          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
              {post.user?.name?.charAt(0).toUpperCase()}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-300"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment, index) => (
              <div key={comment._id} className="flex items-start space-x-3 animate-slideIn" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                  {comment.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-gray-900">{comment.user?.name}</p>
                    {(comment.user?._id === currentUserId || isOwner) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-red-600 transform hover:scale-125 transition-all duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-purple-400" />
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
