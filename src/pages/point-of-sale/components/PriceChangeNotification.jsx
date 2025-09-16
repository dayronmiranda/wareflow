import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriceChangeNotification = ({ 
  priceChanges, 
  onAcceptChanges, 
  onRejectChanges,
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (priceChanges && priceChanges?.length > 0) {
      setIsVisible(true);
    }
  }, [priceChanges]);

  if (!isVisible || !priceChanges || priceChanges?.length === 0) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const handleAccept = () => {
    onAcceptChanges(priceChanges);
    setIsVisible(false);
  };

  const handleReject = () => {
    onRejectChanges(priceChanges);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    setIsVisible(false);
  };

  return (
    <div className="fixed top-20 right-4 max-w-sm bg-card border border-border rounded-lg shadow-elevated z-40">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={16} color="white" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">
              Price Changes Detected
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {priceChanges?.length} product{priceChanges?.length > 1 ? 's have' : ' has'} updated pricing
            </p>
            
            <div className="space-y-2 mb-4">
              {priceChanges?.slice(0, 2)?.map((change) => (
                <div key={change?.productId} className="text-sm">
                  <div className="font-medium text-foreground truncate">
                    {change?.productName}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-muted-foreground line-through">
                      {formatPrice(change?.oldPrice)}
                    </span>
                    <Icon name="ArrowRight" size={12} />
                    <span className="text-success font-medium">
                      {formatPrice(change?.newPrice)}
                    </span>
                  </div>
                </div>
              ))}
              
              {priceChanges?.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{priceChanges?.length - 2} more price changes
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1"
                >
                  Update Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  className="flex-1"
                >
                  Keep Old
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleDismiss}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceChangeNotification;