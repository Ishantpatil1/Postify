import { useState } from 'react';
import { postAPI, uploadAPI } from '../services/api';
import { Heart, MessageCircle, Trash2, Edit, Send, X, Image as ImageIcon } from 'lucide-react';
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
      setEditImageUrl(''); // Clear URL input if file is selected
      
      // Create preview
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

      // Upload new image if file is selected
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
      toast.success('Post updated!');
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data } = await postAPI.addComment(post._id, { content: commentText.trim() });
      onComment(post._id, data.data);
      setCommentText('');
      toast.success('Comment added!');
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
    <div className="card hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {post.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-3 mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            rows="3"
          />
          
          {/* Current or New Image Preview */}
          {(editImagePreview || (post.imageUrl && !editImageFile)) && (
            <div className="relative">
              <img 
                src={editImagePreview || post.imageUrl} 
                alt="Preview" 
                className="w-full max-h-80 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeEditImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Upload Button - Show only if no current image */}
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
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer font-medium"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
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
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full rounded-lg mb-4 max-h-96 object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </>
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center space-x-2 ${
            isLiked ? 'text-red-600' : 'text-gray-600'
          } hover:text-red-600 transition`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Comments List */}
          {post.comments?.map(comment => (
            <div key={comment._id} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {comment.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-gray-900">{comment.user?.name}</p>
                  {(comment.user?._id === currentUserId || isOwner) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
