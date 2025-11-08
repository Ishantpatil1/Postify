import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI, uploadAPI } from '../services/api';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
            rows="3"
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3 relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-80 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
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
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer font-medium"
              >
                <Image className="h-5 w-5" />
                <span className="text-sm">Add Photo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || uploadingImage || !content.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              <Send className="h-4 w-4" />
              <span>
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
