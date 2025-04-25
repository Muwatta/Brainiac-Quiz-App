import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaClock, FaLightbulb } from 'react-icons/fa';

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <div className="p-6 bg-deep-navy text-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-ocean-blue"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        About Brainiac Quiz App
      </motion.h1>

      {/* Introduction */}
      <p className="text-lg mb-4 text-white-slate">
        The Brainiac Quiz App is designed for junior and senior secondary school students to enhance their learning through interactive and engaging quizzes. It provides a platform for students to test their knowledge, improve their skills, and compete with friends in a fun and educational way.
      </p>
      <p className="text-lg mb-4 text-white-700">
        Our goal is to make learning enjoyable and accessible by offering quizzes in various subjects, including Mathematics, Science, History, Literature, and more. The app is equipped with both online and offline capabilities, allowing students to access quizzes anytime, anywhere.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#0248d4]">
        Why Brainiac Quiz App is Unique
      </h2>
      <p className="text-lg mb-4 text-white-700">
        Have you ever noticed how university students prepare for their exams? They don’t study random materials—they focus on past questions (PQs) from their respective universities. Why? Because those questions are tailored to their curriculum, their lecturers, and their unique academic environment. 
      </p>
      <p className="text-lg mb-4 text-white-700">
        The Brainiac Quiz App brings this same concept to secondary school students. The questions in the app are sourced directly from the schools themselves, making it personal, relevant, and highly effective. Students no longer have to rely on generic quiz apps that don’t align with their syllabus. With Brainiac, they can practice with confidence, knowing that the questions are designed specifically for their school’s curriculum.
      </p>
      <p className="text-lg mb-4 text-white-700">
        This innovative approach instills discipline in students, as they are constantly exposed to the type of questions they will encounter in their internal and external exams. It eliminates excuses like “I didn’t have the right materials to study” because Brainiac provides everything they need in one place.
      </p>

      {/* Features Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#0248d4]">
        Features of the Brainiac Quiz App
      </h2>
      <ul className="list-disc list-inside text-lg text-white-700 mb-6">
        <li>
          <FaCheckCircle className="inline-block text-green-500 mr-2" />
          Interactive quizzes with multiple-choice questions.
        </li>
        <li>
          <FaTrophy className="inline-block text-yellow-500 mr-2" />
          Leaderboard to compete with friends and other users.
        </li>
        <li>
          <FaLightbulb className="inline-block text-blue-500 mr-2" />
          Hints and explanations for selected questions.
        </li>
        <li>
          <FaClock className="inline-block text-red-500 mr-2" />
          Timer-based quizzes to challenge your speed and accuracy.
        </li>
        <li>Offline mode to access quizzes without an internet connection.</li>
        <li>Personalized feedback after completing a quiz.</li>
      </ul>

      {/* How to Play Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#0248d4]">
        How to Play the Quiz
      </h2>
      <ol className="list-decimal list-inside text-lg text-white-700 mb-6">
        <li>Select a subject or category to start the quiz.</li>
        <li>Read each question carefully and choose the correct answer.</li>
        <li>Use hints if you're stuck (if enabled).</li>
        <li>Complete the quiz within the given time limit (if applicable).</li>
        <li>Submit your answers to see your score and feedback.</li>
        <li>Check the leaderboard to see how you rank among other players.</li>
      </ol>

      {/* Rules Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#0248d4]">
        Rules of the Game
      </h2>
      <ul className="list-disc list-inside text-lg text-white-700 mb-6">
        <li>Each question has only one correct answer.</li>
        <li>You cannot change your answer once it is submitted.</li>
        <li>Points are awarded for each correct answer.</li>
        <li>Some quizzes may have a time limit, so answer quickly!</li>
        <li>Using hints may reduce your score (if applicable).</li>
        <li>Cheating is discouraged—play fair and have fun!</li>
      </ul>

      {/* Why Use Brainiac Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#0248d4]">
        Why Use Brainiac Quiz App?
      </h2>
      <p className="text-lg mb-4 text-white-700">
        The Brainiac Quiz App is more than just a quiz platform—it's a tool for learning and self-improvement. By practicing with questions sourced directly from their schools, students can build confidence, master their subjects, and prepare effectively for both internal and external exams.
      </p>
      <p className="text-lg mb-4 text-white-700">
        With Brainiac, students can write up to eight internal quizzes before their external exams, ensuring they are fully prepared. This app doesn’t just help students pass—it helps them excel.
      </p>
      <p className="text-lg text-white-700">
        Start your quiz journey today and become a Brainiac!
      </p>
    </div>
  );
};

export default About;
