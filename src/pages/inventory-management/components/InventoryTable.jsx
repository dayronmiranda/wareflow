import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryTable = ({ 
  inventory, 
  selectedWarehouse, 
  onStockAdjustment, 
  onViewHistory,
  userRole 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const sortedInventory = useMemo(() => {
    if (!sortConfig?.key) return inventory;

    return [...inventory]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        return sortConfig?.direction === 'asc' 
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }

      return sortConfig?.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  }, [inventory, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (productId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(productId)) {
        newSet?.delete(productId);
      } else {
        newSet?.add(productId);
      }
      return newSet;
    });
  };

  const getStockStatus = (item) => {
    const { currentStock, minThreshold, maxThreshold } = item;
    
    if (currentStock === 0) return { status: 'out-of-stock', color: 'text-error', bg: 'bg-error/10' };
    if (currentStock <= minThreshold) return { status: 'low-stock', color: 'text-warning', bg: 'bg-warning/10' };
    if (currentStock >= maxThreshold) return { status: 'overstock', color: 'text-accent', bg: 'bg-accent/10' };
    return { status: 'in-stock', color: 'text-success', bg: 'bg-success/10' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-CU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('productName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Product</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('currentStock')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Current Stock</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('reservedStock')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Reserved</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('availableStock')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Available</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Last Updated</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedInventory?.map((item) => {
              const stockStatus = getStockStatus(item);
              const isExpanded = expandedRows?.has(item?.id);
              
              return (
                <React.Fragment key={item?.id}>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleRowExpansion(item?.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Icon 
                            name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                            size={16} 
                          />
                        </button>
                        <div>
                          <div className="font-medium text-foreground">{item?.productName}</div>
                          <div className="text-sm text-muted-foreground">{item?.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{item?.currentStock}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item?.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-warning font-medium">{item?.reservedStock}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item?.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-success font-medium">{item?.availableStock}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item?.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.bg} ${stockStatus?.color}`}>
                        {stockStatus?.status?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(item?.lastUpdated)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Edit"
                          onClick={() => onStockAdjustment(item)}
                        >
                          Adjust
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="History"
                          onClick={() => onViewHistory(item)}
                        >
                          History
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-muted/20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Stock Thresholds</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Minimum:</span>
                                <span className="text-foreground">{item?.minThreshold} {item?.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Maximum:</span>
                                <span className="text-foreground">{item?.maxThreshold} {item?.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Reorder Point:</span>
                                <span className="text-foreground">{item?.reorderPoint} {item?.unit}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Pricing</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Cost Price:</span>
                                <span className="text-foreground">{formatCurrency(item?.costPrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Selling Price:</span>
                                <span className="text-foreground">{formatCurrency(item?.sellingPrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Stock Value:</span>
                                <span className="text-foreground font-medium">{formatCurrency(item?.stockValue)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Location</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Warehouse:</span>
                                <span className="text-foreground">{item?.warehouseName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="text-foreground">{item?.location}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Category:</span>
                                <span className="text-foreground">{item?.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedInventory?.map((item) => {
          const stockStatus = getStockStatus(item);
          const isExpanded = expandedRows?.has(item?.id);
          
          return (
            <div key={item?.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{item?.productName}</h3>
                  <p className="text-sm text-muted-foreground">{item?.sku}</p>
                </div>
                <button
                  onClick={() => toggleRowExpansion(item?.id)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <Icon 
                    name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                    size={20} 
                  />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current Stock</div>
                  <div className="font-medium text-foreground">
                    {item?.currentStock} {item?.unit}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Available</div>
                  <div className="font-medium text-success">
                    {item?.availableStock} {item?.unit}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.bg} ${stockStatus?.color}`}>
                  {stockStatus?.status?.replace('-', ' ')}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit"
                    onClick={() => onStockAdjustment(item)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="History"
                    onClick={() => onViewHistory(item)}
                  />
                </div>
              </div>
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Reserved:</span>
                        <span className="ml-2 text-warning font-medium">{item?.reservedStock} {item?.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min Threshold:</span>
                        <span className="ml-2 text-foreground">{item?.minThreshold} {item?.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stock Value:</span>
                        <span className="ml-2 text-foreground font-medium">{formatCurrency(item?.stockValue)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="ml-2 text-foreground">{item?.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {formatDate(item?.lastUpdated)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryTable;