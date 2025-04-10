# Quiz App for Junior and Senior Secondary School Students

## Overview

This project is a quiz application designed for junior and senior secondary
school students. It provides both online and offline capabilities as a
Progressive Web App (PWA). The application features multiple navigation pages,
including Home, Quiz, Leaderboard, Contact, and About sections.

## Features

- **Progressive Web App (PWA)**: Works offline and can be installed on devices.
- **Multiple Pages**: Navigate through Home, Quiz, Leaderboard, Contact, and
  About sections.
- **User-Friendly Interface**: Designed with students in mind, ensuring ease of
  use.
- **Leaderboard**: Displays top quiz scores to encourage competition among
  students.

## Project Structure

```
quiz-app
├── public
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── src
│   ├── components
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Leaderboard.jsx
│   │   └── Quiz.jsx
│   ├── pages
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LeaderboardPage.jsx
│   │   └── QuizPage.jsx
│   ├── App.jsx
│   ├── index.js
│   └── styles
│       └── App.css
├── package.json
├── README.md
└── .gitignore
```

## Setup Instructions

1. **Clone the Repository**:

   ```
   git clone <repository-url>
   cd quiz-app
   ```

2. **Install Dependencies**:

   ```
   npm install
   ```

3. **Run the Application**:

   ```
   npm start
   ```

4. **Build for Production**:
   ```
   npm run build
   ```

## Technologies Used

- React
- React Router for navigation
- Service Workers for offline capabilities
- CSS for styling

## Contribution

Contributions are welcome! Please feel free to submit a pull request or open an
issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.
