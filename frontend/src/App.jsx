import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import './utils/i18n';

function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock authentication function
  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      const mockUser = {
        id: '1',
        name: formData.email.split('@')[0],
        email: formData.email,
        role: formData.email.includes('teacher') ? 'teacher' : 
              formData.email.includes('admin') ? 'admin' : 'parent'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

// Check for existing user session
useEffect(() => {
  // Comment out auto-login for now
  // const savedUser = localStorage.getItem('user');
  // if (savedUser) {
  //   setUser(JSON.parse(savedUser));
  // }
}, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginForm onSubmit={handleLogin} loading={loading} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? 
                <Dashboard user={user} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;