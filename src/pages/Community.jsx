import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaComments } from 'react-icons/fa';

const Community = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);

  const handlePostSubmit = () => {
    if (newPost.trim() === '') return;
    setPosts((prevPosts) => [
      ...prevPosts,
      { id: Date.now(), content: newPost },
    ]);
    setNewPost('');
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const fileURL = URL.createObjectURL(uploadedFile); // Create a preview URL for the file
      const filePlaceholder =
        uploadedFile.type.startsWith('image/')
          ? `\n![Image Preview](${fileURL})\n`
          : `\n[Video Preview](${fileURL})\n`;
      setNewPost((prevPost) => prevPost + filePlaceholder); // Add file placeholder to the textarea
    }
  };

  return (
    <div className="community-container p-6 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen text-white">
      {/* Animated Heading with Icon */}
      <motion.div
        className="flex justify-center items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaComments className="text-white text-4xl mr-3" /> {/* Conversation Icon */}
        <h1 className="text-3xl font-bold text-center">Community</h1>
      </motion.div>

      {/* New Post Section */}
      <div className="new-post mb-6 relative">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thought with us..."
          className="w-full p-3 rounded-lg text-black"
        ></textarea>

        {/* "+" Button for File Upload */}
        <div className="absolute top-3 right-3">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
          >
            +
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <button
          onClick={handlePostSubmit}
          className="mt-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Post
        </button>
      </div>

      {/* Posts Section */}
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post mb-4 p-4 bg-white text-black rounded-lg">
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;