import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StockWarningAlert = ({ 
  warnings, 
  onDismiss, 
  onViewInventory 
}) => {
  if (!warnings || warnings?.length === 0) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h4 className="font-medium text-warning mb-2">
            Stock Level Warnings ({warnings?.length})
          </h4>
          
          <div className="space-y-2 mb-3">
            {warnings?.slice(0, 3)?.map((warning) => (
              <div key={warning?.productId} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {warning?.productName}
                  </span>
                  <span className="text-warning">
                    {warning?.currentStock} left
                  </span>
                </div>
                <div className="text-muted-foreground text-xs">
                  SKU: {warning?.sku} • {formatPrice(warning?.price)}
                </div>
              </div>
            ))}
            
            {warnings?.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{warnings?.length - 3} more products with low stock
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Package"
              iconPosition="left"
              onClick={onViewInventory}
              className="border-warning text-warning hover:bg-warning/10"
            >
              View Inventory
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onDismiss}
              className="text-warning hover:bg-warning/10"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockWarningAlert;