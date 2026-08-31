import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { PublicAutoLogin } from './components/auth/PublicAutoLogin';
import { StudentLayout } from './layouts/StudentLayout';
import { StudentDashboard } from './pages/student/Dashboard';
import { LabDetails } from './pages/student/LabDetails';
import { BookingCalendar } from './pages/student/BookingCalendar';
import { ReportIssue } from './pages/student/ReportIssue';
import { MyIssues } from './pages/student/MyIssues';
import { CampusMap } from './pages/student/CampusMap';
import { NewsUpdates } from './pages/student/NewsUpdates';
import { FeedbackPage } from './pages/student/FeedbackPage';
import { HelpSupport } from './pages/student/HelpSupport';
import { ProfilePage } from './pages/student/ProfilePage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { RequestHistory } from './pages/student/RequestHistory';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentManagement } from './pages/admin/AdminStudentManagement';
import { FacultyStudentManagement } from './pages/faculty/FacultyStudentManagement';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          {/* Root & Public Direct Access Gateways (Auto-Login) */}
          <Route path="/" element={<PublicAutoLogin />} />
          <Route path="/public" element={<PublicAutoLogin />} />

          {/* Student Portal (STUDENT Only) */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="labs" element={<StudentDashboard />} />
              <Route path="labs/:id" element={<LabDetails />} />
              <Route path="booking-calendar" element={<BookingCalendar />} />
              <Route path="report-issue" element={<ReportIssue />} />
              <Route path="my-issues" element={<MyIssues />} />
              <Route path="campus-map" element={<CampusMap />} />
              <Route path="news-updates" element={<NewsUpdates />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="help-support" element={<HelpSupport />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="request-history" element={<RequestHistory />} />
            </Route>
          </Route>

          {/* Faculty / Staff Portal (STAFF or ADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
            <Route path="/staff" element={<StudentLayout />}>
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/faculty" element={<StudentLayout />}>
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="students" element={<FacultyStudentManagement />} />
              <Route path="students/:studentId" element={<FacultyStudentManagement />} />
            </Route>
          </Route>

          {/* Admin Portal (ADMIN Only) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<StudentLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudentManagement />} />
              <Route path="students/:studentId" element={<AdminStudentManagement />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
  );
};

export default App;
