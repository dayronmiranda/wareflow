import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityMessage = () => {
  return (
    <div className="mt-8 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon name="Shield" size={16} color="var(--color-success)" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Secure Access</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your data is protected with industry-standard security measures. 
            Sessions are automatically managed and encrypted for your safety.
          </p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Session Timeout</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={12} />
              <span>Activity Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMessage;