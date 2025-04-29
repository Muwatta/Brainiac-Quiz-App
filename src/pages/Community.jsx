import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaThumbsUp, FaRegCommentDots } from 'react-icons/fa';

// Fake data for template conversations
const fakeConversations = [
  { id: 1, author: 'Maryam Lawan', content: 'What is the best way to prepare for a quiz?', timestamp: '2 hours ago', likes: 5, comments: [] },
  { id: 2, author: 'Azumi Ibrahim', content: 'Can anyone recommend good resources for learning math?', timestamp: '3 hours ago', likes: 8, comments: [] },
  { id: 3, author: 'AI Bot', content: 'Remember to stay hydrated and take breaks while studying!', timestamp: '4 hours ago', likes: 12, comments: [] },
  { id: 4, author: 'Abbass', content: 'How do I improve my time management during exams?', timestamp: '1 day ago', likes: 3, comments: [] },
  { id: 5, author: 'Hawau Ejura', content: 'What are some tips for staying focused while studying?', timestamp: '2 days ago', likes: 7, comments: [] },
  { id: 6, author: 'Hafsah Cisse', content: 'Who followed the honorable minister update on Education?', timestamp: '2 days ago', likes: 7, comments: [] },
  { id: 7, author: 'Nafisah Hamzah', content: 'Do you know that N-ICT for girls is really shaping the narrative in the industry?', timestamp: '2 days ago', likes: 7, comments: [] },
];

const Community = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load fake conversations on component mount
  useEffect(() => {
    setPosts(fakeConversations);
  }, []);

  const handlePostSubmit = () => {
    if (newPost.trim() === '' || author.trim() === '') {
      setErrorMessage('Please enter your name and post content.');
      return;
    }

    const newPostData = {
      id: Date.now(),
      author,
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: [],
    };

    setPosts((prevPosts) => [newPostData, ...prevPosts]);
    setNewPost('');
    setAuthor('');
    setErrorMessage('');
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

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId, comment) => {
    if (comment.trim() === '') return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, { id: Date.now(), text: comment }] }
          : post
      )
    );
  };

  const generateAIResponse = (content) => {
    if (content.toLowerCase().includes('quiz')) {
      return 'AI Bot: Practice regularly and review past questions to prepare for your quiz!';
    } else if (content.toLowerCase().includes('math')) {
      return 'AI Bot: Khan Academy and Brilliant.org are great resources for learning math!';
    } else if (content.toLowerCase().includes('focus')) {
      return 'AI Bot: Try using the Pomodoro technique to stay focused while studying.';
    } else {
      return 'AI Bot: That’s an interesting question! Let me think about it.';
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
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 mb-3 rounded-lg text-black"
        />
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

        {errorMessage && (
          <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
        )}
      </div>

      {/* Posts Section */}
      <div className="posts">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post mb-4 p-4 bg-white text-black rounded-lg"
          >
            <div className="post-header mb-2">
              <h3 className="text-lg font-bold">{post.author}</h3>
              <p className="text-sm text-gray-600">{post.timestamp}</p>
            </div>
            <p className="mb-2">{post.content}</p>

            {/* AI Response */}
            {post.author !== 'AI Bot' && (
              <p className="text-sm text-blue-500 mt-2">
                {generateAIResponse(post.content)}
              </p>
            )}

            {/* Like and Comment Buttons */}
            <div className="post-actions flex items-center space-x-4 mt-2">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
              >
                <FaThumbsUp />
                <span>{post.likes}</span>
              </button>
              <button
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
              >
                <FaRegCommentDots />
                <span>{post.comments.length}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="comments mt-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="comment mb-2 p-2 bg-gray-100 rounded-lg"
                >
                  <p>{comment.text}</p>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full p-2 mt-2 border rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment(post.id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;