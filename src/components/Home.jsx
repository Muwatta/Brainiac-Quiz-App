import React from 'react';
import Slider from 'react-slick';

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    cssEase: 'linear',
  };

  const carouselItems = [
    { id: 1, content: 'Slide 1: Welcome to the Quiz App!' },
    { id: 2, content: 'Slide 2: Test your knowledge!' },
    { id: 3, content: 'Slide 3: Compete with friends!' },
    { id: 4, content: 'Slide 4: Track your progress!' },
    { id: 5, content: 'Slide 5: Learn while having fun!' },
    { id: 6, content: 'Slide 6: Start your quiz journey now!' },
  ];

  return (
    <div className="home-container min-h-screen bg-gradient-to-b from-[#CADCFC] via-[#8AB6F9] to-[#00246B] text-gray-800">
      <header className="home-header">
        <h1 className="text-4xl font-bold text-center mb-6 text-[#00246B]">
          Welcome to the Quiz App
        </h1>
      </header>
      <div className="carousel">
        <Slider {...settings}>
          {carouselItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-center h-64 bg-white text-[#00246B] rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold">{item.content}</h2>
            </div>
          ))}
        </Slider>
      </div>
      <footer className="home-footer mt-8 text-center">
        <button className="start-quiz-button bg-[#00246B] text-white px-6 py-3 rounded-lg hover:bg-[#8AB6F9] hover:text-[#00246B] transition-colors">
          Start Quiz
        </button>
      </footer>
    </div>
  );
};

export default Home;
