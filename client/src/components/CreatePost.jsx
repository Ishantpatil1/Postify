import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI, uploadAPI } from '../services/api';
import { Image, Send, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    setIsLoading(true);
    try {
      let finalImageUrl = '';

      // Upload image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await uploadAPI.uploadImage(formData);
        finalImageUrl = `http://localhost:5000${uploadResponse.data.data.imageUrl}`;
        setUploadingImage(false);
      }

      const postData = {
        content: content.trim(),
        ...(finalImageUrl && { imageUrl: finalImageUrl })
      };

      const { data } = await postAPI.createPost(postData);
      onPostCreated(data.data);
      setContent('');
      removeImage();
      setIsFocused(false);
      toast.success('🎉 Post created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className={`card transform transition-all duration-500 ${isFocused ? 'scale-105 shadow-2xl ring-2 ring-purple-400' : ''} animate-scaleIn`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-purple-100 transform hover:scale-110 transition-transform duration-300">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !content && setIsFocused(false)}
              placeholder="What's on your mind? Share something amazing..."
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:border-purple-300 placeholder:text-gray-400"
              rows={isFocused ? "4" : "2"}
            />
            {isFocused && (
              <div className="absolute top-2 right-2">
                <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative animate-scaleIn">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-80 rounded-2xl object-cover shadow-xl ring-4 ring-purple-100"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center space-x-2 px-5 py-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-300 cursor-pointer font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Image className="h-5 w-5" />
                <span className="text-sm">Add Photo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || uploadingImage || !content.trim()}
              className="flex items-center space-x-2 px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <Send className="h-5 w-5" />
              <span className="font-semibold">
                {uploadingImage ? 'Uploading...' : isLoading ? 'Posting...' : 'Post'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
