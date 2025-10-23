import React, {useEffect} from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import TreksPage from './pages/TreksPage';
import TrekDetailsPage from './pages/TrekDetailsPage';
import TrekRegistrationPage from './pages/TrekRegistrationPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BlogsListPage from './pages/BlogsListPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import ScrollToTop from './components/utils/ScrollToTop';
import BlogPage from './pages/BlogPage';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/treks" element={<TreksPage />} />
          <Route path="/treks/:id" element={<TrekDetailsPage />} />
          <Route path="/treks/:id/register" element={
            <ProtectedRoute>
              <TrekRegistrationPage />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/blogs" element={<BlogsListPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;