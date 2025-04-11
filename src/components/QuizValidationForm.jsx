import React, { useState } from 'react';

const QuizValidationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    class: '',
    subject: '',
    profilePicture: null,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.school ||
      !formData.class ||
      !formData.subject
    ) {
      alert('All fields except the profile picture are required!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="validation-form p-10 bg-deep-navy rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Player Information
      </h2>
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
            <option value="Maths">Maths</option>
            <option value="English">English</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Government">Government</option>
            <option value="Literature">Literature</option>
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
