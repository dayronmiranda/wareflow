import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ProductFilters = ({ onFiltersChange, totalProducts, filteredCount }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    priceRange: { min: '', max: '' }
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'tools', label: 'Tools & Hardware' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'books', label: 'Books & Media' },
    { value: 'sports', label: 'Sports & Recreation' }
  ];

  const stockStatusOptions = [
    { value: '', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'overstocked', label: 'Overstocked' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (type, value) => {
    const newPriceRange = { ...filters?.priceRange, [type]: value };
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      stockStatus: '',
      priceRange: { min: '', max: '' }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters?.search || filters?.category || filters?.stockStatus || 
    filters?.priceRange?.min || filters?.priceRange?.max;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          fullWidth
        >
          Filters & Search
        </Button>
      </div>
      {/* Filter Controls */}
      <div className={`space-y-4 ${!isExpanded ? 'hidden lg:block' : ''}`}>
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search products by name, SKU, or description..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>
          
          {/* Results Counter */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Package" size={16} />
            <span>
              {filteredCount} of {totalProducts} products
            </span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <Select
            label="Category"
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => handleFilterChange('category', value)}
            placeholder="Select category"
          />

          {/* Stock Status Filter */}
          <Select
            label="Stock Status"
            options={stockStatusOptions}
            value={filters?.stockStatus}
            onChange={(value) => handleFilterChange('stockStatus', value)}
            placeholder="Select stock status"
          />

          {/* Price Range - Min */}
          <Input
            label="Min Price (CUP)"
            type="number"
            placeholder="0"
            value={filters?.priceRange?.min}
            onChange={(e) => handlePriceRangeChange('min', e?.target?.value)}
            min="0"
            step="0.01"
          />

          {/* Price Range - Max */}
          <Input
            label="Max Price (CUP)"
            type="number"
            placeholder="1000"
            value={filters?.priceRange?.max}
            onChange={(e) => handlePriceRangeChange('max', e?.target?.value)}
            min="0"
            step="0.01"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;