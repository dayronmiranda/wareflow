import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StockHistoryModal = ({ 
  isOpen, 
  onClose, 
  product, 
  stockHistory 
}) => {
  const [sortOrder, setSortOrder] = useState('desc');

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-CU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const getTransactionIcon = (type) => {
    const iconMap = {
      'sale': 'ShoppingCart',
      'adjustment': 'Edit',
      'transfer-in': 'ArrowDown',
      'transfer-out': 'ArrowUp',
      'return': 'RotateCcw',
      'damage': 'AlertTriangle',
      'expired': 'Clock',
      'initial': 'Package'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getTransactionColor = (type, change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const sortedHistory = [...stockHistory]?.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Stock Movement History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {product?.productName} ({product?.sku})
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              iconName={sortOrder === 'desc' ? 'ArrowDown' : 'ArrowUp'}
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Current Stock Summary */}
        <div className="p-6 bg-muted/30 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{product?.currentStock}</div>
              <div className="text-sm text-muted-foreground">Current Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{product?.reservedStock}</div>
              <div className="text-sm text-muted-foreground">Reserved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{product?.availableStock}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(product?.stockValue)}</div>
              <div className="text-sm text-muted-foreground">Stock Value</div>
            </div>
          </div>
        </div>

        {/* History Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {sortedHistory?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon name="History" size={48} color="var(--color-muted-foreground)" />
              <h3 className="text-lg font-medium text-foreground mt-4">No History Available</h3>
              <p className="text-sm text-muted-foreground mt-2">
                No stock movements have been recorded for this product yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedHistory?.map((entry, index) => (
                <div key={index} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      entry?.stockChange > 0 ? 'bg-success/10' : 
                      entry?.stockChange < 0 ? 'bg-error/10' : 'bg-muted'
                    }`}>
                      <Icon 
                        name={getTransactionIcon(entry?.type)} 
                        size={16} 
                        color={getTransactionColor(entry?.type, entry?.stockChange)}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{entry?.description}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {entry?.performedBy} • {formatDate(entry?.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getTransactionColor(entry?.type, entry?.stockChange)}`}>
                            {entry?.stockChange > 0 ? '+' : ''}{entry?.stockChange} {product?.unit}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Balance: {entry?.stockAfter} {product?.unit}
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      {(entry?.reference || entry?.notes || entry?.costPrice) && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            {entry?.reference && (
                              <div>
                                <span className="text-muted-foreground">Reference:</span>
                                <span className="ml-2 text-foreground">{entry?.reference}</span>
                              </div>
                            )}
                            {entry?.costPrice && (
                              <div>
                                <span className="text-muted-foreground">Cost Price:</span>
                                <span className="ml-2 text-foreground">{formatCurrency(entry?.costPrice)}</span>
                              </div>
                            )}
                            {entry?.location && (
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <span className="ml-2 text-foreground">{entry?.location}</span>
                              </div>
                            )}
                          </div>
                          {entry?.notes && (
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Notes:</span>
                              <span className="ml-2 text-foreground">{entry?.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {sortedHistory?.length} transaction{sortedHistory?.length !== 1 ? 's' : ''} found
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModal;