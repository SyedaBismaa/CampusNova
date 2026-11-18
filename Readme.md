# CampusNova 🎓
### Student Task Management & Achievement Tracking System

CampusNova is a web-based platform designed to streamline student task management, submission verification, and achievement tracking within a college.

The platform provides a centralized workspace where students can view assigned tasks, submit their work, track submission status, and monitor their performance through a points-based leaderboard. Administrators can manage tasks, review student submissions, and track overall student progress.

## 🚀 Features

### 👨‍🎓 Student Module
- Student authentication and login.
- Personalized student dashboard.
- View available tasks and deadlines.
- Submit completed tasks with supporting links.
- Upload GitHub, Google Drive, Canva, and report links.
- Track submission status (Pending, Approved, Rejected).
- Earn points for approved submissions.
- View leaderboard rankings.

### 👨‍💼 Admin Module
- Admin authentication.
- Admin dashboard with performance statistics.
- Create and manage student tasks.
- View all student submissions.
- Review and approve/reject submissions.
- Provide feedback on submissions.
- Automatically award points for approved tasks.
- View student leaderboard and rankings.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## 📁 Project Structure

```text
CampusNova/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CampusNova
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

Open the application at:

`http://localhost:5173`

## 🔐 Authentication & Authorization

CampusNova uses JWT-based authentication to secure application routes.

- Passwords are hashed using bcryptjs.
- JWT tokens are generated during login.
- Protected routes require valid authentication.
- Role-based authorization restricts administrative operations to admins.

## 📊 Points & Leaderboard System

CampusNova includes a points-based achievement system.

- Students receive points when their submissions are approved.
- Student rankings are calculated based on accumulated points.
- The leaderboard displays student rankings and performance.

## 🔮 Future Enhancements

- Student profile management.
- Notifications for task deadlines and submission reviews.
- Advanced performance analytics.
- File upload functionality.
- Improved mobile responsiveness.

## 👩‍💻 Developed By

**Syeda Bisma**

Final Year B.Tech – Computer Science Engineering

CampusNova – Student Success Hub

---

*Built to simplify student task management, encourage participation, and recognize student achievements.*
