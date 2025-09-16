import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityMessage from './components/SecurityMessage';
import LoginFooter from './components/LoginFooter';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('wareflow_user');
    if (user) {
      const userData = JSON.parse(user);
      // Redirect based on role
      if (userData?.role === 'owner') {
        navigate('/warehouse-management');
      } else {
        navigate('/inventory-management');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-lg">
        <div className="bg-card border border-border rounded-2xl shadow-elevated p-8 sm:p-10">
          {/* Header Section */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Security Message */}
          <SecurityMessage />
          
          {/* Footer */}
          <LoginFooter />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default LoginPage;