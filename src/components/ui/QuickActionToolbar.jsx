import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = ({ userRole = 'manager' }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getQuickActions = () => {
    const currentPath = location?.pathname;
    
    const commonActions = [
      {
        id: 'new-sale',
        label: 'New Sale',
        icon: 'Plus',
        action: () => console.log('Creating new sale'),
        variant: 'default',
        show: ['/point-of-sale', '/', '/inventory-management']
      },
      {
        id: 'quick-search',
        label: 'Search Products',
        icon: 'Search',
        action: () => console.log('Opening product search'),
        variant: 'outline',
        show: ['/product-management', '/inventory-management', '/point-of-sale']
      },
      {
        id: 'new-transfer',
        label: 'New Transfer',
        icon: 'ArrowRightLeft',
        action: () => console.log('Creating new transfer'),
        variant: 'outline',
        show: ['/transfer-requests', '/', '/inventory-management']
      }
    ];

    const ownerActions = [
      {
        id: 'add-warehouse',
        label: 'Add Warehouse',
        icon: 'Building',
        action: () => console.log('Adding new warehouse'),
        variant: 'outline',
        show: ['/warehouse-management', '/']
      },
      {
        id: 'reports',
        label: 'View Reports',
        icon: 'BarChart3',
        action: () => console.log('Opening reports'),
        variant: 'ghost',
        show: ['/', '/inventory-management', '/warehouse-management']
      }
    ];

    const pathSpecificActions = [
      {
        id: 'add-product',
        label: 'Add Product',
        icon: 'Package',
        action: () => console.log('Adding new product'),
        variant: 'default',
        show: ['/product-management']
      },
      {
        id: 'stock-adjustment',
        label: 'Adjust Stock',
        icon: 'Edit',
        action: () => console.log('Opening stock adjustment'),
        variant: 'outline',
        show: ['/inventory-management']
      },
      {
        id: 'bulk-import',
        label: 'Import Data',
        icon: 'Upload',
        action: () => console.log('Opening bulk import'),
        variant: 'ghost',
        show: ['/product-management', '/inventory-management']
      }
    ];

    let actions = [...commonActions, ...pathSpecificActions];
    
    if (userRole === 'owner') {
      actions = [...actions, ...ownerActions];
    }

    return actions?.filter(action => action?.show?.includes(currentPath));
  };

  const quickActions = getQuickActions();

  if (quickActions?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Toolbar */}
      <div className="hidden lg:flex items-center justify-between bg-card border-b border-border px-6 py-3">
        <div className="flex items-center space-x-3">
          {quickActions?.slice(0, 4)?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant}
              size="sm"
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.action}
              className="transition-all duration-150 ease-out"
            >
              {action?.label}
            </Button>
          ))}
          
          {quickActions?.length > 4 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                More
              </Button>
              
              {isExpanded && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-elevated z-50">
                  {quickActions?.slice(4)?.map((action) => (
                    <button
                      key={action?.id}
                      onClick={() => {
                        action?.action();
                        setIsExpanded(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150 ease-out first:rounded-t-md last:rounded-b-md"
                    >
                      <Icon name={action?.icon} size={16} />
                      <span>{action?.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Zap" size={14} />
          <span>Quick Actions</span>
        </div>
      </div>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <div className="relative">
          <Button
            variant="default"
            size="icon"
            iconName={isExpanded ? "X" : "Plus"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 rounded-full shadow-elevated"
          />
          
          {isExpanded && (
            <div className="absolute bottom-16 right-0 w-48 bg-popover border border-border rounded-md shadow-elevated">
              {quickActions?.map((action, index) => (
                <button
                  key={action?.id}
                  onClick={() => {
                    action?.action();
                    setIsExpanded(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150 ease-out first:rounded-t-md last:rounded-b-md"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 200ms ease-out forwards'
                  }}
                >
                  <Icon name={action?.icon} size={16} />
                  <span>{action?.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default QuickActionToolbar;