import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = [
    { username: 'owner@wareflow', password: 'owner123', role: 'owner', name: 'Carlos Rodriguez' },
    { username: 'manager@wareflow', password: 'manager123', role: 'manager', name: 'Maria Gonzalez' },
    { username: 'admin@wareflow', password: 'admin123', role: 'owner', name: 'Jose Martinez' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const user = mockCredentials?.find(
        cred => cred?.username === formData?.username && cred?.password === formData?.password
      );
      
      if (user) {
        // Store user session
        localStorage.setItem('wareflow_user', JSON.stringify({
          username: user?.username,
          role: user?.role,
          name: user?.name,
          loginTime: new Date()?.toISOString(),
          rememberMe: formData?.rememberMe
        }));
        
        // Redirect based on role
        if (user?.role === 'owner') {
          navigate('/warehouse-management');
        } else {
          navigate('/inventory-management');
        }
      } else {
        setErrors({
          general: 'Invalid username or password. Please try again.'
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors?.general && (
          <div className="bg-error/10 border border-error/20 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData?.username}
            onChange={handleInputChange}
            error={errors?.username}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>Owner: owner@wareflow / owner123</div>
            <div>Manager: manager@wareflow / manager123</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;