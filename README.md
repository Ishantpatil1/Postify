# Task Management System

A full-stack **Task Management Application** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). This application allows users to create, manage, and track their tasks with features like authentication, filtering, pagination, and statistics.

## 🚀 Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes and role-based access control (User/Admin)
- Persistent login sessions

### Task Management
- **Create** tasks with title, description, priority, status, due date, and tags
- **Read** tasks with advanced filtering, search, and pagination
- **Update** tasks (edit any field)
- **Delete** tasks with confirmation
- Task statistics dashboard (total, completed, pending, in-progress)
- Priority levels: Low, Medium, High
- Status tracking: Pending, In Progress, Completed

### User Interface
- Responsive design with Tailwind CSS
- Modern and intuitive UI
- Real-time notifications with toast messages
- Loading states and error handling
- Filter tasks by status, priority, and search query
- Sort tasks by date, priority, or title

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **react-hot-toast** - Notifications

## 📁 Project Structure

```
task-management/
├── server/                      # Backend
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Custom middleware
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # API routes
│   │   ├── utils/               # Utility functions
│   │   └── server.js            # App entry point
│   └── package.json
│
└── client/                      # Frontend
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── context/             # React context
    │   ├── pages/               # Page components
    │   ├── services/            # API services
    │   └── App.jsx              # Root component
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation & Setup

**✅ Dependencies are already installed!**

The backend and frontend dependencies have been installed. You just need to:

1. **Start MongoDB**
```powershell
net start MongoDB
```

2. **Run the Backend** (from `server` directory):
```powershell
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

3. **Run the Frontend** (from `client` directory - open new terminal):
```powershell
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

### Environment Variables

✅ **Already configured!**

**Server** (`.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

**Client** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/updatedetails` | Update user details | Yes |
| PUT | `/api/auth/updatepassword` | Change password | Yes |

### Task Endpoints (All Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks with filtering |
| GET | `/api/tasks/stats` | Get task statistics |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Query Parameters
- `search` - Search in title and description
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `sort` - Sort field (e.g., -createdAt, dueDate, title)
- `page` - Page number for pagination
- `limit` - Items per page

**Example:**
```
GET /api/tasks?status=pending&priority=high&sort=-createdAt&page=1&limit=10
```

## 🔐 Authentication

Uses **JWT (JSON Web Tokens)**:
1. User registers/logs in
2. Server generates JWT token
3. Client stores token in localStorage
4. Token included in Authorization header: `Bearer <token>`
5. Server verifies token for protected routes

## 💾 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  role: String ('user' or 'admin'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: String ('pending', 'in-progress', 'completed'),
  priority: String ('low', 'medium', 'high'),
  dueDate: Date,
  tags: [String],
  user: ObjectId (ref: User),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Application Pages

### 📊 Dashboard
- Overview of all tasks with statistics
- Visual progress bars for task status distribution
- Priority distribution charts
- Total, completed, pending, and in-progress task counts

### ✅ Tasks
- Complete task management interface
- Create, edit, and delete tasks
- Advanced filtering (status, priority, search)
- Sort by date, priority, or title
- Pagination for large task lists
- Task cards with status badges and priority indicators

### 👤 Profile
- View and edit user information
- Update name and email
- Change password securely
- Account details display

### 🔐 Authentication
- User registration with validation
- Secure login system
- Password strength requirements
- Persistent sessions

## 🧪 Available Scripts

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (hot reload)
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🚀 Quick Start Guide

1. **Ensure MongoDB is running:**
   ```powershell
   net start MongoDB
   ```

2. **Terminal 1 - Start Backend:**
   ```powershell
   cd "D:\internship final folder\server"
   npm run dev
   ```
   ✅ Backend running at http://localhost:5000

3. **Terminal 2 - Start Frontend:**
   ```powershell
   cd "D:\internship final folder\client"
   npm run dev
   ```
   ✅ Frontend running at http://localhost:5173

4. **Open browser and navigate to:**
   ```
   http://localhost:5173
   ```

5. **Register a new account and start managing tasks!**

## 🐛 Troubleshooting

### MongoDB Connection Issues
- **Error:** Cannot connect to MongoDB
- **Solution:** Ensure MongoDB is running: `net start MongoDB`
- Check connection string in `server/.env`

### CORS Errors
- **Error:** CORS policy blocking requests
- **Solution:** Verify `VITE_API_URL` in `client/.env` matches backend URL
- Ensure CORS is configured in `server/src/server.js`

### Port Already in Use
- **Error:** Port 5000 or 5173 already in use
- **Solution:** Kill process or change port in `.env` files

### Authentication Issues
- **Error:** Token expired or invalid
- **Solution:** Clear browser localStorage and login again
- Verify `JWT_SECRET` is set in `server/.env`

## 📝 Features Checklist

✅ User Authentication (Register/Login)  
✅ JWT-based Authorization  
✅ Protected Routes  
✅ Task CRUD Operations  
✅ Task Filtering & Search  
✅ Task Sorting & Pagination  
✅ Task Statistics Dashboard  
✅ User Profile Management  
✅ Password Change Functionality  
✅ Responsive Design  
✅ Toast Notifications  
✅ Loading States  
✅ Error Handling  
✅ Form Validation  

## 🎯 Default User Roles

- **User** - Can manage their own tasks
- **Admin** - Can manage all users and tasks (additional endpoints)

## 📦 Dependencies Installed

### Backend
- express, mongoose, bcryptjs, jsonwebtoken
- express-validator, helmet, cors, morgan
- dotenv, multer, nodemailer
- Dev: nodemon, jest, supertest, eslint

### Frontend
- react, react-router-dom, axios
- tailwindcss, react-hot-toast
- lucide-react (icons), date-fns
- Dev: vite, eslint

## 🌟 Highlights

- **Professional Architecture** - MVC pattern with separation of concerns
- **Security First** - JWT auth, password hashing, input validation, helmet security headers
- **Modern UI** - Tailwind CSS, responsive design, smooth animations
- **Developer Experience** - Hot reload, ESLint, Prettier, clear code structure
- **Production Ready** - Error handling, logging, environment configs

## 📄 License

MIT License

---

**🎉 Everything is set up and ready to go!**

Just start MongoDB, run the backend and frontend servers, and you're good to go! 🚀

**Happy Task Managing! 🎯**
