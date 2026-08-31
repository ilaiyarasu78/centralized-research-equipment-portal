import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import labRoutes from './routes/labRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import bookingRoutes from './routes/bookingRoutes';
import issueRoutes from './routes/issueRoutes';
import notificationRoutes from './routes/notificationRoutes';
import extraRoutes from './routes/extraRoutes';
import studentRoutes from './routes/studentRoutes';
import adminStudentRoutes from './routes/adminStudentRoutes';
import facultyStudentRoutes from './routes/facultyStudentRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminStudentRoutes);
app.use('/api/faculty', facultyStudentRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', extraRoutes);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'SMART CAMPUS Lab & Equipment Management System API',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SMART CAMPUS Backend API running on http://localhost:${PORT}`);
});
