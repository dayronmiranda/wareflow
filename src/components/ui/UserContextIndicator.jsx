import React, { useState } from 'react';
import Icon from '../AppIcon';

const UserContextIndicator = ({ userRole = 'manager', currentWarehouse = 'Main Warehouse', warehouses = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const defaultWarehouses = [
    { id: 1, name: 'Main Warehouse', location: 'Downtown' },
    { id: 2, name: 'North Branch', location: 'North District' },
    { id: 3, name: 'South Branch', location: 'South District' },
  ];

  const warehouseList = warehouses?.length > 0 ? warehouses : defaultWarehouses;

  const handleWarehouseSwitch = (warehouse) => {
    console.log('Switching to warehouse:', warehouse?.name);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-150 ease-out"
      >
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" />
          <div className="text-left">
            <div className="text-sm font-medium text-foreground">{currentWarehouse}</div>
            <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isDropdownOpen && userRole === 'owner' && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-popover border border-border rounded-md shadow-elevated z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Switch Warehouse
            </div>
            {warehouseList?.map((warehouse) => (
              <button
                key={warehouse?.id}
                onClick={() => handleWarehouseSwitch(warehouse)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors duration-150 ease-out ${
                  warehouse?.name === currentWarehouse
                    ? 'bg-primary text-primary-foreground'
                    : 'text-popover-foreground hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name="Building" size={16} />
                  <div className="text-left">
                    <div className="font-medium">{warehouse?.name}</div>
                    <div className="text-xs opacity-75">{warehouse?.location}</div>
                  </div>
                </div>
                {warehouse?.name === currentWarehouse && (
                  <Icon name="Check" size={16} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {isDropdownOpen && userRole === 'manager' && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-elevated z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-popover-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Building" size={16} />
                <div>
                  <div className="font-medium">{currentWarehouse}</div>
                  <div className="text-xs text-muted-foreground">Manager Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContextIndicator;