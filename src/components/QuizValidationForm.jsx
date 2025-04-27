import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

const QuizValidationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    class: '',
    subject: '',
    profilePicture: null,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState([]); 
  useEffect(() => {
    const savedUser = localStorage.getItem('quizUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setFormData(userData);
      setIsLoggedIn(true); 
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'class') {
      if (value.startsWith('JSS')) {
        setSubjects([
          'Maths',
          'English',
          'Basic Science',
          'Basic Technology',
          'Computer',
          'Hausa',
        ]);
      } else if (value.startsWith('SS')) {
        setSubjects([
          'Maths',
          'English',
          'Physics',
          'Chemistry',
          'Government',
          'Literature',
        ]);
      } else {
        setSubjects([]); // Clear subjects if no class is selected
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.school || !formData.class || !formData.subject) {
      alert('All fields except the profile picture are required!');
      return;
    }

    localStorage.setItem('quizUser', JSON.stringify(formData));
    setIsLoggedIn(true); 
    onSubmit(formData); 
  };

  const handleSignOut = () => {
    localStorage.removeItem('quizUser'); 
    setFormData({
      name: '',
      school: '',
      class: '',
      subject: '',
      profilePicture: null,
    });
    setIsLoggedIn(false); 
  };

  const handleRestartQuiz = () => {
    setShowRestartModal(true);
  };

  const handleRestartWithSameSubject = () => {
    setShowRestartModal(false); 
    onSubmit(formData); // Retake the quiz with the same subject
  };

  const handleChooseNewSubject = () => {
    setShowRestartModal(false); // Close the modal
    setNewSubject(''); // Reset the new subject dropdown
  };

  const handleNewSubjectSubmit = () => {
    if (!newSubject) {
      alert('Please select a new subject!');
      return;
    }
    const updatedFormData = { ...formData, subject: newSubject };
    setFormData(updatedFormData);
    onSubmit(updatedFormData); // Start the quiz with the new subject
  };

  if (isLoggedIn) {
    return (
      <div className="validation-form p-10 bg-deep-navy rounded-lg shadow-md text-center">
        <motion.div
          className="flex justify-center items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Favicon */}
          <motion.div
            className="text-white text-3xl mr-2"
            animate={{
              scale: [1, 1.2, 1], // Scale up and down
              rotate: [0, 15, -15, 0], // Rotate slightly
            }}
            transition={{
              duration: 1.5, // Animation duration
              repeat: Infinity, // Repeat animation infinitely
              repeatType: "loop", // Loop the animation
            }}
          >
            <FaUser />
          </motion.div>

          {/* Welcome Back Text */}
          <h2 className="text-2xl font-bold text-center text-white">
            {formData.name}
          </h2>
        </motion.div>
        <p className="text-white mb-4">You are logged in as:</p>
        <ul className="text-white mb-6">
          <li><strong>School:</strong> {formData.school}</li>
          <li><strong>Class:</strong> {formData.class}</li>
          <li><strong>Subject:</strong> {formData.subject}</li>
        </ul>
        <button
          onClick={handleRestartQuiz}
          className="w-full bg-blue-950 text-white py-3 px-4 rounded hover:bg-blue-600 mb-4"
        >
          Restart Quiz
        </button>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-3 px-4 rounded hover:bg-red-800"
        >
          Sign Out
        </button>

        {/* Restart Confirmation Modal */}
        {showRestartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-bold mb-4">Restart Quiz</h3>
              <p className="mb-4">
                Do you want to retake the quiz with the same subject ({formData.subject})?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRestartWithSameSubject}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Yes
                </button>
                <button
                  onClick={handleChooseNewSubject}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Class and Subject Dropdowns */}
        <div className="mt-6">
          {/* Class Dropdown */}
          <select
            value={formData.class}
            onChange={(e) => {
              const selectedClass = e.target.value;
              setFormData((prev) => ({ ...prev, class: selectedClass, subject: '' })); // Reset subject
              if (selectedClass.startsWith('JSS')) {
                setSubjects([
                  'Maths',
                  'English',
                  'Basic Science',
                  'Basic Technology',
                  'Computer',
                  'Hausa',
                ]);
              } else if (selectedClass.startsWith('SS')) {
                setSubjects([
                  'Maths',
                  'English',
                  'Physics',
                  'Chemistry',
                  'Government',
                  'Literature',
                ]);
              } else {
                setSubjects([]); // Clear subjects if no class is selected
              }
            }}
            className="w-full border border-white rounded px-3 py-3 mb-3"
          >
            <option value="">Select a new class</option>
            <option value="JSS1">JSS1</option>
            <option value="JSS2">JSS2</option>
            <option value="JSS3">JSS3</option>
            <option value="SS1">SS1</option>
            <option value="SS2">SS2</option>
            <option value="SS3">SS3</option>
          </select>

          {/* Subject Dropdown */}
          <select
            value={formData.subject}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full border border-white rounded px-3 py-3 mb-3"
          >
            <option value="">Select a new subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!formData.class || !formData.subject) {
                alert('Please select both class and subject!');
                return;
              }
              onSubmit(formData); // Start the quiz with the updated class and subject
            }}
            className="w-full bg-blue-950 text-white py-3 px-4 rounded hover:bg-blue-600"
          >
            Start Quiz with New Class and Subject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-form p-10 bg-deep-navy rounded-lg shadow-md">
      {/* Animated Heading with Icon */}
      <motion.div
        className="flex justify-center items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaUser className="text-white text-3xl mr-2" /> {/* User Icon */}
        <h2 className="text-2xl font-bold text-center text-white">
          Player Information
        </h2>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-midnight-blue rounded px-3 py-3 mb-3"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="w-full border border-white rounded px-3 py-3 mb-3"
            placeholder="Enter your school"
            required
          />
        </div>
        <div>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="w-full border border-white rounded px-3 py-3 mb-3"
            required
          >
            <option value="">Select your class</option>
            <option value="JSS1">JSS1</option>
            <option value="JSS2">JSS2</option>
            <option value="JSS3">JSS3</option>
            <option value="SS1">SS1</option>
            <option value="SS2">SS2</option>
            <option value="SS3">SS3</option>
          </select>
        </div>
        <div>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-white rounded px-3 py-3 mb-3"
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Profile Picture (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-white rounded text-white px-3 py-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-950 text-white py-3 px-4 rounded hover:bg-blue-600"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizValidationForm;