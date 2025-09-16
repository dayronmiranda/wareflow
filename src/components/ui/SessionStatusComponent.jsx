import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionStatusComponent = ({ sessionTimeout = 30, onLogout, onExtendSession }) => {
  const [timeRemaining, setTimeRemaining] = useState(sessionTimeout * 60); // Convert minutes to seconds
  const [showWarning, setShowWarning] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSessionActive(false);
          if (onLogout) onLogout();
          return 0;
        }
        
        // Show warning when 5 minutes or less remaining
        if (prev <= 300 && !showWarning) {
          setShowWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, onLogout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    setTimeRemaining(sessionTimeout * 60);
    setShowWarning(false);
    if (onExtendSession) onExtendSession();
  };

  const handleLogout = () => {
    setIsSessionActive(false);
    if (onLogout) onLogout();
  };

  if (!isSessionActive) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg shadow-elevated max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-error rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Session Expired</h3>
              <p className="text-sm text-muted-foreground">Please log in again to continue</p>
            </div>
          </div>
          <Button 
            variant="default" 
            fullWidth 
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (showWarning) {
    return (
      <div className="fixed top-20 right-4 bg-warning text-warning-foreground p-4 rounded-lg shadow-elevated z-40 max-w-sm">
        <div className="flex items-start space-x-3">
          <Icon name="Clock" size={20} />
          <div className="flex-1">
            <h4 className="font-medium">Session Expiring Soon</h4>
            <p className="text-sm opacity-90 mt-1">
              Your session will expire in {formatTime(timeRemaining)}
            </p>
            <div className="flex space-x-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleExtendSession}
                className="bg-white text-warning hover:bg-gray-50"
              >
                Extend Session
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleLogout}
                className="text-warning-foreground hover:bg-warning/20"
              >
                Logout
              </Button>
            </div>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-warning-foreground hover:bg-warning/20 p-1 rounded"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Subtle session indicator (always visible)
  return (
    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
      <span className="hidden sm:inline">Active</span>
    </div>
  );
};

export default SessionStatusComponent;