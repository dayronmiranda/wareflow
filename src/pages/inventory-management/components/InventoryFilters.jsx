import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InventoryFilters = ({ 
  filters, 
  onFiltersChange, 
  warehouses, 
  categories,
  userRole,
  onClearFilters,
  onBulkImport 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stockStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'overstock', label: 'Overstock' }
  ];

  const warehouseOptions = [
    { value: 'all', label: 'All Warehouses' },
    ...warehouses?.map(warehouse => ({
      value: warehouse?.id,
      label: warehouse?.name
    }))
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories?.map(category => ({
      value: category,
      label: category
    }))
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters?.search || 
           filters?.warehouse !== 'all' || 
           filters?.category !== 'all' || 
           filters?.stockStatus !== 'all' ||
           filters?.minStock ||
           filters?.maxStock;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} />
          <span className="font-medium text-foreground">Filters</span>
          {hasActiveFilters() && (
            <span className="w-2 h-2 bg-primary rounded-full"></span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              type="search"
              placeholder="Search products, SKU..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Warehouse Filter */}
          <div>
            <Select
              placeholder="Select warehouse"
              options={warehouseOptions}
              value={filters?.warehouse}
              onChange={(value) => handleFilterChange('warehouse', value)}
              disabled={userRole === 'manager' && warehouseOptions?.length <= 2}
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select
              placeholder="Select category"
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange('category', value)}
            />
          </div>

          {/* Stock Status Filter */}
          <div>
            <Select
              placeholder="Stock status"
              options={stockStatusOptions}
              value={filters?.stockStatus}
              onChange={(value) => handleFilterChange('stockStatus', value)}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClearFilters}
              >
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              onClick={onBulkImport}
            >
              Import
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="number"
                label="Min Stock Level"
                placeholder="0"
                value={filters?.minStock}
                onChange={(e) => handleFilterChange('minStock', e?.target?.value)}
                min="0"
              />
            </div>
            <div>
              <Input
                type="number"
                label="Max Stock Level"
                placeholder="1000"
                value={filters?.maxStock}
                onChange={(e) => handleFilterChange('maxStock', e?.target?.value)}
                min="0"
              />
            </div>
            <div>
              <Input
                type="date"
                label="Updated After"
                value={filters?.updatedAfter}
                onChange={(e) => handleFilterChange('updatedAfter', e?.target?.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                label="Updated Before"
                value={filters?.updatedBefore}
                onChange={(e) => handleFilterChange('updatedBefore', e?.target?.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters() && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={14} />
              <span>
                Active filters: {[
                  filters?.search && 'Search',
                  filters?.warehouse !== 'all' && 'Warehouse',
                  filters?.category !== 'all' && 'Category',
                  filters?.stockStatus !== 'all' && 'Status',
                  filters?.minStock && 'Min Stock',
                  filters?.maxStock && 'Max Stock'
                ]?.filter(Boolean)?.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryFilters;