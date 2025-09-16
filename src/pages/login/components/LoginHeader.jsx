import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="Package" size={32} color="white" />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl font-bold text-foreground mb-2">WareFlow</h1>
      
      {/* Tagline */}
      <p className="text-muted-foreground text-lg mb-6">
        Warehouse Management System
      </p>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to access your warehouse dashboard and manage your inventory
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;