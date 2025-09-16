import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PriceHistoryModal = ({ isOpen, onClose, product }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  // Mock price history data
  const priceHistory = [
    {
      id: 1,
      date: new Date('2024-01-15'),
      warehouseId: 'global',
      warehouseName: 'Global Price',
      oldPrice: 45.00,
      newPrice: 50.00,
      changeType: 'increase',
      reason: 'Supplier cost increase',
      changedBy: 'Maria Rodriguez',
      changePercent: 11.11
    },
    {
      id: 2,
      date: new Date('2024-02-01'),
      warehouseId: 'warehouse-1',
      warehouseName: 'Main Warehouse',
      oldPrice: 50.00,
      newPrice: 48.00,
      changeType: 'decrease',
      reason: 'Local promotion',
      changedBy: 'Carlos Martinez',
      changePercent: -4.00
    },
    {
      id: 3,
      date: new Date('2024-02-15'),
      warehouseId: 'warehouse-2',
      warehouseName: 'North Branch',
      oldPrice: 50.00,
      newPrice: 52.00,
      changeType: 'increase',
      reason: 'Regional demand adjustment',
      changedBy: 'Ana Garcia',
      changePercent: 4.00
    },
    {
      id: 4,
      date: new Date('2024-03-01'),
      warehouseId: 'global',
      warehouseName: 'Global Price',
      oldPrice: 50.00,
      newPrice: 55.00,
      changeType: 'increase',
      reason: 'Market price adjustment',
      changedBy: 'Maria Rodriguez',
      changePercent: 10.00
    }
  ];

  const warehouseOptions = [
    { value: 'all', label: 'All Warehouses' },
    { value: 'global', label: 'Global Price Changes' },
    { value: 'warehouse-1', label: 'Main Warehouse' },
    { value: 'warehouse-2', label: 'North Branch' },
    { value: 'warehouse-3', label: 'South Branch' }
  ];

  const filteredHistory = selectedWarehouse === 'all' 
    ? priceHistory 
    : priceHistory?.filter(entry => entry?.warehouseId === selectedWarehouse);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 2
    })?.format(price);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-CU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? 'TrendingUp' : 'TrendingDown';
  };

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-error' : 'text-success';
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Price History</h2>
              <p className="text-sm text-muted-foreground">
                {product?.name} ({product?.sku})
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Current Price Summary */}
        <div className="p-6 bg-muted/30 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Global Price</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(product?.globalPrice)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Price Changes</p>
              <p className="text-2xl font-bold text-foreground">{priceHistory?.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <p className="text-lg font-medium text-foreground">
                {formatDate(new Date())}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Icon name="Filter" size={16} color="var(--color-muted-foreground)" />
              <span className="text-sm font-medium text-foreground">Filter by location:</span>
            </div>
            <Select
              options={warehouseOptions}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              className="w-full sm:w-64"
            />
          </div>
        </div>

        {/* Price History Timeline */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {filteredHistory?.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory?.map((entry, index) => (
                <div key={entry?.id} className="relative">
                  {/* Timeline Line */}
                  {index < filteredHistory?.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      entry?.changeType === 'increase' ? 'bg-error/10' : 'bg-success/10'
                    }`}>
                      <Icon 
                        name={getChangeIcon(entry?.changeType)} 
                        size={20} 
                        className={getChangeColor(entry?.changeType)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-card border border-border rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-foreground">{entry?.warehouseName}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              entry?.changeType === 'increase' ?'bg-error/10 text-error' :'bg-success/10 text-success'
                            }`}>
                              {entry?.changePercent > 0 ? '+' : ''}{entry?.changePercent?.toFixed(1)}%
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span>{formatDate(entry?.date)}</span>
                            <span>•</span>
                            <span>Changed by {entry?.changedBy}</span>
                          </div>
                          
                          <p className="text-sm text-foreground">{entry?.reason}</p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                            <span>From</span>
                            <span className="font-medium text-foreground">{formatPrice(entry?.oldPrice)}</span>
                            <Icon name="ArrowRight" size={14} />
                            <span className="font-medium text-foreground">{formatPrice(entry?.newPrice)}</span>
                          </div>
                          <div className={`text-sm font-medium ${getChangeColor(entry?.changeType)}`}>
                            {entry?.changeType === 'increase' ? '+' : '-'}
                            {formatPrice(Math.abs(entry?.newPrice - entry?.oldPrice))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="TrendingUp" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No price history found</h3>
              <p className="text-muted-foreground">
                {selectedWarehouse === 'all' ?'This product has no recorded price changes.' :'No price changes found for the selected warehouse.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {filteredHistory?.length} price change{filteredHistory?.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" iconName="Download" iconPosition="left">
              Export History
            </Button>
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryModal;