<div align="center">

<img src="https://img.shields.io/badge/DRISHTI-Disaster%20Command-d9534f?style=for-the-badge&logo=globe&logoColor=white" alt="DRISHTI Banner"/>

# 🌍 DRISHTI — Disaster Command Platform

### *AI-Powered Disaster Monitoring, Prediction & Real-Time Response*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-drishti--command.vercel.app-0070f3?style=flat-square)](https://drishti-command.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-drishti--api.onrender.com-10b981?style=flat-square)](https://drishti-api.onrender.com)
[![ML Service](https://img.shields.io/badge/🤖%20ML%20Service-drishti--ml.onrender.com-8b5cf6?style=flat-square)](https://drishti-ml.onrender.com/docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

</div>

---

## 📌 Overview

**DRISHTI** *(Hindi: दृष्टि — Vision)* is a production-grade, full-stack disaster management platform that unifies real-time monitoring, AI-powered risk prediction, rescue coordination, and interactive visualization into a single command dashboard.

Built to empower **emergency authorities, relief organizations, and first responders** with the situational awareness and decision-support tools needed to act faster during crises.

> *"When every second counts, smarter decisions save lives."*

---

## 🚀 Live URLs

| Service | URL | Status |
|---|---|---|
| 🌐 Frontend | [drishti-command.vercel.app](https://drishti-command.vercel.app) | ![Vercel](https://img.shields.io/badge/Vercel-Live-brightgreen?style=flat-square) |
| ⚙️ Backend API | [drishti-api.onrender.com](https://drishti-api.onrender.com) | ![Render](https://img.shields.io/badge/Render-Live-brightgreen?style=flat-square) |
| 🤖 ML Swagger Docs | [drishti-ml.onrender.com/docs](https://drishti-ml.onrender.com/docs) | ![FastAPI](https://img.shields.io/badge/FastAPI-Live-brightgreen?style=flat-square) |

---

## ✨ Key Features

### 🔴 Real-Time Monitoring
- Live disaster alerts via **Socket.io** WebSocket streams
- Dynamic dashboard with auto-refreshing incident feeds
- Severity-level classification (Low / Medium / High / Critical)

### 🤖 AI-Based Prediction
- ML models for **Flood, Cyclone, Landslide & Heatwave** risk prediction
- Built on **scikit-learn** with historical disaster datasets
- Confidence scores and risk-level output per prediction

### 🗺️ Interactive Disaster Map
- Geospatial visualization of active disaster zones
- Shelter locations and evacuation route overlays
- Clustered incident markers with drill-down detail

### 🚨 Multi-Channel Alert System
- Create and broadcast alerts from the admin panel
- **Email notifications** via EmailJS
- **Browser push notifications** for field teams

### 👨‍🚒 Rescue Team Management
- Track active rescue teams and their deployment status
- Dynamic resource allocation and assignment
- Mission log and incident history

### 📊 Analytics Dashboard
- Real-time risk level trends and historical charts
- Weather data integration for situational context
- Export-ready reporting for authorities

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│              CLIENT LAYER                    │
│         React 18 + Vite + Socket.io          │
│         Hosted on Vercel (CDN)               │
└────────────────────┬────────────────────────┘
                     │  REST API + WebSocket
                     ▼
┌─────────────────────────────────────────────┐
│              APPLICATION LAYER               │
│         Node.js + Express.js                 │
│         JWT Auth + MongoDB Atlas             │
│         Hosted on Render                     │
└────────────────────┬────────────────────────┘
                     │  Internal HTTP
                     ▼
┌─────────────────────────────────────────────┐
│               ML SERVICE LAYER               │
│         Python FastAPI                       │
│         scikit-learn Prediction Models       │
│         Hosted on Render                     │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Socket.io Client, Axios |
| **Backend** | Node.js, Express.js, Socket.io, JWT |
| **Database** | MongoDB Atlas (Cloud) |
| **ML Service** | Python, FastAPI, scikit-learn, Uvicorn |
| **Notifications** | EmailJS, Web Push API |
| **Deployment** | Vercel (Frontend), Render (Backend + ML) |

---

## 📁 Project Structure

```
drishti-disaster-command/
│
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── services/         # API & Socket service modules
│   │   └── context/          # Global state (Auth, Alerts)
│   ├── public/
│   ├── vercel.json           # SPA routing config
│   └── .env                  # Frontend environment variables
│
├── server/                   # Node.js Backend (Express)
│   ├── routes/               # API route definitions
│   ├── models/               # Mongoose data models
│   ├── middleware/           # Auth, error handling
│   ├── controllers/          # Business logic
│   └── .env                  # Backend environment variables
│
└── ml-service/               # Python ML API (FastAPI)
    ├── models/               # Trained .pkl model files
    ├── app.py                # FastAPI application entry
    ├── train_all.py          # Model training script
    └── requirements.txt      # Python dependencies
```

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js `v18+`
- Python `3.11+`
- MongoDB Atlas account (or local MongoDB)
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/drishti-disaster-command.git
cd drishti-disaster-command
```

### 2️⃣ Frontend Setup

```bash
cd client
npm install
cp .env.example .env       # Add your environment variables
npm run dev                # Runs at http://localhost:5173
```

### 3️⃣ Backend Setup

```bash
cd server
npm install
cp .env.example .env       # Add your environment variables
npm run dev                # Runs at http://localhost:5000
```

### 4️⃣ ML Service Setup

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS / Linux

pip install -r requirements.txt
python train_all.py         # Train ML models (first run only)
uvicorn app:app --reload    # Runs at http://localhost:8000
```

---

## 🔑 Environment Variables

### Frontend — `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_ML_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:5000

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Backend — `server/.env`

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Deployment Guide

### Frontend → Vercel

| Setting | Value |
|---|---|
| Framework | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add all `VITE_*` environment variables in the Vercel dashboard.

### Backend → Render (Web Service)

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |

### ML API → Render (Web Service)

| Setting | Value |
|---|---|
| Root Directory | `ml-service` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt && python train_all.py` |
| Start Command | `uvicorn app:app --host 0.0.0.0 --port $PORT` |

> ⚠️ **Note:** Free tier Render services sleep after 15 minutes of inactivity. The first request after sleep may take ~30 seconds to respond.

---

## 📸 Screenshots

> *(Add screenshots here)*

| Dashboard | Disaster Map |
|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Map](screenshots/map.png) |

| Alert Panel | AI Prediction |
|---|---|
| ![Alerts](screenshots/alerts.png) | ![ML](screenshots/prediction.png) |

---

## 🔮 Roadmap

- [ ] 📱 Mobile app (React Native)
- [ ] 🛰️ Satellite imagery integration
- [ ] 🧠 Deep learning model upgrades
- [ ] 📩 SMS alert system (Twilio)
- [ ] 🌐 Multi-language support (Hindi, Telugu, Tamil)
- [ ] 🔁 Offline-first PWA support

---

## 🤝 Contributing

Contributions are welcome and appreciated!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

Please follow [conventional commits](https://www.conventionalcommits.org/) and ensure your code is tested before submitting a PR.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- [scikit-learn](https://scikit-learn.org/) — ML model framework
- [FastAPI](https://fastapi.tiangolo.com/) — Python API framework
- [Socket.io](https://socket.io/) — Real-time communication
- [EmailJS](https://www.emailjs.com/) — Client-side email notifications
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database

---

<div align="center">

**Built with ❤️ for India's emergency response ecosystem**

⭐ **Star this repo** if DRISHTI helped or inspired you!

[![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/drishti-disaster-command?style=social)](https://github.com/YOUR_USERNAME/drishti-disaster-command)

---

*🔥 DRISHTI — Smarter Disaster Response Starts Here 🚨🌍*

</div>