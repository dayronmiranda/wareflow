import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-12 text-center space-y-4">
      {/* Support Links */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
          <Icon name="HelpCircle" size={14} />
          <span>Help Center</span>
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
          <Icon name="Phone" size={14} />
          <span>Support</span>
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
          <Icon name="Mail" size={14} />
          <span>Contact</span>
        </button>
      </div>

      {/* System Status */}
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span>All systems operational</span>
      </div>

      {/* Copyright */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} WareFlow. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Warehouse Management System v2.1.0
        </p>
      </div>
    </div>
  );
};

export default LoginFooter;