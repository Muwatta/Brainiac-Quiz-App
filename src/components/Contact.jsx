import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa'; // Import envelope icon

const developers = [
  {
    id: 1,
    name: 'Abdullah Musliudeen',
    image: '/images/muwatta.jpg',
    description:
      'Community builder, committed to equipping the next generation with future-ready skills through hands-on training, real-world projects, and technology-driven learning experiences.',
    skills: ['Instructor', 'Software Dev', 'AI', 'Automator'],
  },
  {
    id: 2,
    name: 'Nafisah Hamzah',
    image: '/images/nafisah.jpg',
    description:
      'Designer and developer with a keen eye for detail. A seasonal debator.',
    skills: ['Frontend Dev', 'Creativity', 'Teamwork'],
  },
  {
    id: 3,
    name: 'Hawau Ejura Muhammad',
    image: '/images/ejuraEtBabawo.jpg',
    description:
      'Passionate about creativity, a good reader of novels. Loves to learn new things.',
    skills: ['Frontend Dev', 'Reading', 'Traveling'],
  },
  {
    id: 4,
    name: 'Hafsah Cisse',
    image: '/images/hafsah.jpg',
    description:
      'Skilled mobile developer with expertise in cross-platform solutions',
    skills: ['Designer', 'Creativity', 'Teamwork'],
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#145369] via-[#134b5f] to-[#000000] text-white">
      <div className="container mx-auto p-6">
        {/* Animated Heading with Icon */}
        <motion.div
          className="flex justify-center items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaEnvelope className="text-white text-3xl mr-2" /> {/* Envelope Icon */}
          <h1 className="text-3xl font-bold text-center">Contact Us</h1>
        </motion.div>

        <p className="mb-8 text-center">
          If you have any questions or feedback, feel free to reach out!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map(dev => (
            <div
              key={dev.id}
              className="bg-[#0f3c4c] shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow max-w-sm mx-auto p-4 border-r-4 border-b-4 border-[#0b2d39] hover:border-[#150a72]"
              style={{ filter: 'drop-shadow(0 0 5px #000)' }}
            >
              <div className="flex justify-center">
                <img
                  src={dev.image}
                  alt={`${dev.name} Cover`}
                  className="w-32 h-32 object-cover rounded-full shadow-xl border-4 border-blue-300 bg-blue-200"
                  style={{ filter: 'drop-shadow(0 0 5px #000)' }}
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold mb-2">{dev.name}</h2>
                <p className="text-gray-300 text-sm mb-2">{dev.description}</p>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>Skills:</strong> {dev.skills.join(', ')}
                </p>
                <button className="bg-[#134b5f] text-white px-4 py-2 rounded hover:bg-[#0b2d39]">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-2 hover:text-[#3497399c]">Email:</h2>
          <p>algorisetechexplorers@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;