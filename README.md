# Task Manager - Full-Stack Application

A modern, full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates complete CRUD operations, JWT authentication, protected routes, and real-time UI updates.

## 🚀 Features

### Backend Features
- ✅ **RESTful API** with Express.js
- ✅ **MongoDB Database** with Mongoose ODM
- ✅ **JWT Authentication** with secure token management
- ✅ **Password Hashing** using bcryptjs
- ✅ **Protected Routes** with authentication middleware
- ✅ **Server-side Validation** using express-validator
- ✅ **CORS Configuration** for frontend-backend communication
- ✅ **Error Handling** with proper HTTP status codes

### Frontend Features
- ✅ **React 18** with Vite for fast development
- ✅ **React Router** for client-side routing
- ✅ **Context API** for global state management
- ✅ **Protected Routes** requiring authentication
- ✅ **JWT Token Management** with localStorage
- ✅ **Real-time UI Updates** when tasks change
- ✅ **Client-side Validation** for forms
- ✅ **Modern Design** with glassmorphism and animations
- ✅ **Responsive Layout** for mobile and desktop
- ✅ **Dark Theme** with gradient accents

### Task Management
- ✅ Create new tasks with title and description
- ✅ View all your tasks in one place
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Mark tasks as complete/incomplete
- ✅ View task statistics (total, completed, in progress)
- ✅ User-specific tasks (each user sees only their tasks)

## 📁 Project Structure

```
Task_Manager/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Task.js         # Task schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── tasks.js        # Task CRUD routes
│   ├── .env                # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js           # Main server file
│
└── frontend/               # React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   # Route protection
    │   │   ├── TaskForm.jsx          # Task creation form
    │   │   └── TaskItem.jsx          # Individual task display
    │   ├── context/
    │   │   └── AuthContext.jsx       # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx             # Login page
    │   │   ├── Register.jsx          # Registration page
    │   │   └── Dashboard.jsx         # Main dashboard
    │   ├── services/
    │   │   └── api.js                # API service layer
    │   ├── App.jsx           # Root component
    │   ├── main.jsx          # Entry point
    │   └── index.css         # Global styles
    ├── .env                  # Environment variables
    ├── package.json
    └── vite.config.js
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free cloud database)
  - [Local MongoDB](https://www.mongodb.com/try/download/community) installation

## 🚀 Installation & Setup

### 1. Clone or Download the Project

Navigate to the project directory:
```bash
cd Task_Manager
```

### 2. Backend Setup

#### Step 1: Navigate to backend folder
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure environment variables

Open `backend/.env` and update the following:

```env
# MongoDB Connection String
# Option 1: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Secret (Change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000
```

**Getting MongoDB Atlas Connection String:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your database credentials

#### Step 4: Start the backend server
```bash
npm run dev
```

You should see:
```
✅ Server is running on port 5000
MongoDB Connected: ...
```

### 3. Frontend Setup

Open a **new terminal** window (keep backend running):

#### Step 1: Navigate to frontend folder
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure environment variables

The `frontend/.env` file should already have:
```env
VITE_API_URL=http://localhost:5000/api
```

(No changes needed if running locally)

#### Step 4: Start the frontend development server
```bash
npm run dev
```

You should see:
```
  VITE ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage Guide

### 1. Create an Account

1. Click "Sign up here" on the login page
2. Enter a username (minimum 3 characters)
3. Enter a valid email address
4. Create a password (minimum 6 characters)
5. Confirm your password
6. Click "Sign Up"

### 2. Login

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to the dashboard

### 3. Manage Tasks

#### Create a Task
1. In the "Add New Task" section
2. Enter a title (required)
3. Optionally add a description
4. Click "Create Task"

#### Edit a Task
1. Click "Edit" button on any task
2. Modify the title or description
3. Click "Save" or "Cancel"

#### Mark Complete/Incomplete
1. Click the checkbox next to a task
2. Task status updates immediately

#### Delete a Task
1. Click "Delete" button on any task
2. Confirm the deletion

### 4. View Statistics

At the bottom of the dashboard, see:
- Total number of tasks
- Completed tasks count
- In-progress tasks count

### 5. Logout

Click the "Logout" button in the top-right corner

## 🔌 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Routes (Protected - Require JWT Token)

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn React",
  "description": "Complete React tutorial"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn React Advanced",
  "completed": true
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🎨 Design Features

- **Modern Dark Theme** with gradient backgrounds
- **Glassmorphism Effects** on cards
- **Smooth Animations** and transitions
- **Responsive Design** for all screen sizes
- **Custom Color Palette** with CSS variables
- **Professional Typography** using Inter font
- **Micro-interactions** on hover and click

## 🔒 Security Features

- **Password Hashing** - Passwords are hashed using bcryptjs before storage
- **JWT Tokens** - Secure token-based authentication
- **Protected Routes** - Backend middleware prevents unauthorized access
- **Input Validation** - Both client and server-side validation
- **CORS Configuration** - Controlled cross-origin access
- **Token Expiration** - JWT tokens expire after 30 days

## 🧠 Learning Outcomes

This project covers:

### Backend Concepts
- ✅ RESTful API design
- ✅ MongoDB schema design with Mongoose
- ✅ User authentication with JWT
- ✅ Password hashing and security
- ✅ Middleware implementation
- ✅ Error handling
- ✅ Server-side validation
- ✅ CORS configuration

### Frontend Concepts
- ✅ React component architecture
- ✅ React Hooks (useState, useEffect, useContext)
- ✅ Context API for state management
- ✅ React Router for navigation
- ✅ Protected routes implementation
- ✅ API integration with Axios
- ✅ Form handling and validation
- ✅ localStorage for token persistence
- ✅ Modern CSS and responsive design

### Full-Stack Integration
- ✅ Frontend-backend communication
- ✅ Authentication flow
- ✅ CRUD operations
- ✅ Real-time UI updates
- ✅ Error handling across layers

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check your MongoDB URI in `.env`
- Ensure MongoDB is running (if using local)
- Check network access in MongoDB Atlas

**Port Already in Use**
- Change PORT in `backend/.env` to a different number
- Kill the process using port 5000

### Frontend Issues

**API Connection Error**
- Ensure backend is running on port 5000
- Check VITE_API_URL in `frontend/.env`
- Check browser console for CORS errors

**Login/Register Not Working**
- Check network tab in browser developer tools
- Verify backend is receiving requests
- Check MongoDB connection

## 📝 Code Comments

All code files include **comprehensive comments** explaining:
- What each function does
- How state management works
- Why certain patterns are used
- Step-by-step logic explanation

This makes the codebase perfect for learning!

## 🚀 Future Enhancements

Possible features to add:
- Task categories/tags
- Task priority levels
- Due dates and reminders
- Task search and filters
- User profile management
- Password reset functionality
- Email notifications
- Task sharing between users
- Dark/light theme toggle
- Export tasks to PDF/CSV

## 📄 License

This project is open-source and available for educational purposes.

## 👨‍💻 Author

Built as a learning project to demonstrate full-stack development with the MERN stack.

---

## 🎯 Quick Start Summary

```bash
# Terminal 1 - Backend
cd backend
npm install
# Configure .env file with MongoDB URI
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Open browser
http://localhost:3000
```

**Happy Task Managing! 📝✨**
