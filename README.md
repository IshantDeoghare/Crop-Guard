# 🌿 Crop Guard - Plant Disease Prediction & Agricultural Assistant

**Crop Guard** is a modern web application designed to empower users in identifying plant diseases through image analysis. Beyond prediction, it serves as a comprehensive agricultural hub, offering localized weather updates, relevant farming news, and an intelligent AI chatbot (AgriBot) for tailored advice and disease management suggestions.

[![React Badge](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js Badge](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![FastAPI Badge](https://img.shields.io/badge/ML%20API-FastAPI-05998b?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB Badge](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase Badge](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## ✨ Features

*   **🔍 Plant Disease Prediction:** Upload images of Potato, Tomato, or Bell Pepper leaves for AI-driven disease identification (TensorFlow models).
*   **💡 AI-Powered Suggestions:** Receive actionable treatment/management advice from AgriBot, considering the prediction, weather, and optional land size.
*   **☀️ Weather Insights:** Access current, 7-day historical, and 3-day forecast weather data for **Nagpur, India** (via WeatherAPI.com).
*   **📰 Agriculture News:** Get the latest farming news relevant to India (via GNews.io).
*   **🤖 AgriBot Chat:** Interact with a specialized AI assistant (Groq) for answers to your agriculture questions.
*   **🔒 Secure Authentication:** User login/signup via Firebase Authentication (Email/Password & Google).
*   **📜 Prediction History:** Review your past disease predictions (for logged-in users).
*   **📱 Responsive Design:** Built with React & Bootstrap for a seamless experience on desktop and mobile.

---
## 🛠️ Tech Stack

*   **Frontend:** React, React Router, Axios, Bootstrap, React-Bootstrap, Firebase SDK (Client), date-fns
*   **Backend:** Node.js, Express.js, Mongoose, Axios, Firebase Admin SDK, Multer, date-fns, Groq SDK, CORS, dotenv
*   **ML Service:** Python, FastAPI, TensorFlow, Pillow, NumPy, Uvicorn
*   **Database:** MongoDB (via MongoDB Atlas)
*   **Authentication:** Firebase Authentication
*   **External APIs:** WeatherAPI.com, GNews.io, Groq

---
