import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const WarehouseFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  locationFilter, 
  onLocationFilterChange,
  managerFilter,
  onManagerFilterChange,
  onClearFilters 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'havana', label: 'Havana' },
    { value: 'santiago', label: 'Santiago de Cuba' },
    { value: 'camaguey', label: 'Camagüey' },
    { value: 'holguin', label: 'Holguín' },
    { value: 'matanzas', label: 'Matanzas' }
  ];

  const managerOptions = [
    { value: 'all', label: 'All Managers' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || managerFilter !== 'all';

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Warehouses</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search warehouses by name or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="Filter by status"
          />
        </div>

        {/* Location Filter */}
        <div>
          <Select
            options={locationOptions}
            value={locationFilter}
            onChange={onLocationFilterChange}
            placeholder="Filter by location"
          />
        </div>

        {/* Manager Assignment Filter */}
        <div className="md:col-span-2 lg:col-span-1">
          <Select
            options={managerOptions}
            value={managerFilter}
            onChange={onManagerFilterChange}
            placeholder="Filter by manager"
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={14} />
            <span>Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}
              </span>
            )}
            {locationFilter !== 'all' && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                Location: {locationOptions?.find(opt => opt?.value === locationFilter)?.label}
              </span>
            )}
            {managerFilter !== 'all' && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                Manager: {managerOptions?.find(opt => opt?.value === managerFilter)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseFilters;