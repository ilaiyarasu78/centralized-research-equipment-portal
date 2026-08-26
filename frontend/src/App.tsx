import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { StudentLayout } from './layouts/StudentLayout';
import { StudentDashboard } from './pages/student/Dashboard';
import { LabDetails } from './pages/student/LabDetails';
import { MyBookings } from './pages/student/MyBookings';
import { BookingCalendar } from './pages/student/BookingCalendar';
import { ReportIssue } from './pages/student/ReportIssue';
import { MyIssues } from './pages/student/MyIssues';
import { CampusMap } from './pages/student/CampusMap';
import { LostFound } from './pages/student/LostFound';
import { NewsUpdates } from './pages/student/NewsUpdates';
import { FeedbackPage } from './pages/student/FeedbackPage';
import { HelpSupport } from './pages/student/HelpSupport';
import { ProfilePage } from './pages/student/ProfilePage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { RequestHistory } from './pages/student/RequestHistory';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 3D Campus Digital Twin Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          {/* Root Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student Portal Layout & Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="labs" element={<StudentDashboard />} />
            <Route path="labs/:id" element={<LabDetails />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="booking-calendar" element={<BookingCalendar />} />
            <Route path="report-issue" element={<ReportIssue />} />
            <Route path="my-issues" element={<MyIssues />} />
            <Route path="campus-map" element={<CampusMap />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="news-updates" element={<NewsUpdates />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="help-support" element={<HelpSupport />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="request-history" element={<RequestHistory />} />
          </Route>

          {/* Staff Portal */}
          <Route path="/staff" element={<StudentLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<StudentLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
