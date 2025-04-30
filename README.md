# 🌿 Crop Guard - Plant Disease Prediction & Agricultural Assistant

**Crop Guard** is a modern web application designed to empower users in identifying plant diseases through image analysis. Beyond prediction, it serves as a comprehensive agricultural hub, offering localized weather updates, relevant farming news, and an intelligent AI chatbot (AgriBot) for tailored advice and disease management suggestions.

<!-- Row 1: Frontend, Backend, ML API, Database -->
<p align="left">
  <a href="https://reactjs.org/" title="React"><img src="https://img.shields.io/badge/FRONTEND-REACT-29B6F6?style=for-the-badge&logo=react&logoColor=white" alt="React Badge"></a> 
  <a href="https://nodejs.org/" title="Node.js"><img src="https://img.shields.io/badge/BACKEND-NODE.JS-66BB6A?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"></a> 
  <a href="https://fastapi.tiangolo.com/" title="FastAPI"><img src="https://img.shields.io/badge/ML_API-FASTAPI-26A69A?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI Badge"></a> 
  <a href="https://www.mongodb.com/" title="MongoDB"><img src="https://img.shields.io/badge/DATABASE-MONGODB-9CCC65?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Badge"></a> 
</p>
<!-- Row 2: Auth -->
<p align="left">
   <a href="https://firebase.google.com/" title="Firebase"><img src="https://img.shields.io/badge/AUTH-FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge"></a> 
</p>

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
