import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const TransferRequestFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  warehouses = [],
  userRole = 'manager',
  currentWarehouse = 'Main Warehouse'
}) => {
  const mockWarehouses = [
    { value: 'all', label: 'All Warehouses' },
    { value: 'main-warehouse', label: 'Main Warehouse' },
    { value: 'north-branch', label: 'North Branch' },
    { value: 'south-branch', label: 'South Branch' },
    { value: 'east-warehouse', label: 'East Warehouse' },
    { value: 'west-depot', label: 'West Depot' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-transit', label: 'In Transit' }
  ];

  const warehouseOptions = warehouses?.length > 0 ? 
    [{ value: 'all', label: 'All Warehouses' }, ...warehouses] : 
    mockWarehouses;

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={16} />
          <span>Filters</span>
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Warehouse Filter */}
        <Select
          label="Warehouse"
          placeholder="Select warehouse"
          options={warehouseOptions}
          value={filters?.warehouse || 'all'}
          onChange={(value) => handleFilterChange('warehouse', value)}
        />

        {/* Status Filter */}
        <Select
          label="Status"
          placeholder="Select status"
          options={statusOptions}
          value={filters?.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Date Range - From */}
        <Input
          label="From Date"
          type="date"
          value={filters?.dateFrom || ''}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
        />

        {/* Date Range - To */}
        <Input
          label="To Date"
          type="date"
          value={filters?.dateTo || ''}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
        />
      </div>
      {/* Search Bar */}
      <div className="mt-4">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search by request ID, product name, or justification..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground mr-2">Quick filters:</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange('status', 'pending')}
          className={filters?.status === 'pending' ? 'bg-warning/10 text-warning' : ''}
        >
          Pending Requests
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFilterChange('status', 'approved')}
          className={filters?.status === 'approved' ? 'bg-success/10 text-success' : ''}
        >
          Approved
        </Button>

        {userRole === 'manager' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('warehouse', currentWarehouse?.toLowerCase()?.replace(' ', '-'))}
            className={filters?.warehouse === currentWarehouse?.toLowerCase()?.replace(' ', '-') ? 'bg-primary/10 text-primary' : ''}
          >
            My Warehouse
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const today = new Date()?.toISOString()?.split('T')?.[0];
            handleFilterChange('dateFrom', today);
          }}
          className={filters?.dateFrom === new Date()?.toISOString()?.split('T')?.[0] ? 'bg-accent/10 text-accent' : ''}
        >
          Today
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const weekAgo = new Date();
            weekAgo?.setDate(weekAgo?.getDate() - 7);
            handleFilterChange('dateFrom', weekAgo?.toISOString()?.split('T')?.[0]);
          }}
        >
          Last 7 Days
        </Button>
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Info" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Active filters:</span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters)?.map(([key, value]) => {
                if (!value || value === 'all' || value === '') return null;
                
                let displayValue = value;
                if (key === 'warehouse') {
                  const warehouse = warehouseOptions?.find(w => w?.value === value);
                  displayValue = warehouse?.label || value;
                } else if (key === 'status') {
                  const status = statusOptions?.find(s => s?.value === value);
                  displayValue = status?.label || value;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                  >
                    <span>{displayValue}</span>
                    <button
                      onClick={() => handleFilterChange(key, key === 'search' ? '' : 'all')}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferRequestFilters;