import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShoppingCart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    // 10% tax rate for Cuba
    return subtotal * 0.10;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  if (cartItems?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ShoppingCart" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Cart is Empty</h3>
          <p className="text-muted-foreground">
            Search and add products to start a new sale
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Cart Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="ShoppingCart" size={20} />
          <h3 className="text-lg font-semibold text-foreground">
            Shopping Cart ({cartItems?.length})
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="Trash2"
          onClick={onClearCart}
          className="text-error hover:text-error"
        >
          Clear All
        </Button>
      </div>
      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {cartItems?.map((item) => (
          <div key={item?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground truncate">
                      {item?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item?.sku}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {formatPrice(item?.price)} each
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => onRemoveItem(item?.id)}
                    className="text-error hover:text-error ml-2"
                  />
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Minus"
                      onClick={() => onUpdateQuantity(item?.id, Math.max(1, item?.quantity - 1))}
                      disabled={item?.quantity <= 1}
                      className="w-8 h-8 p-0"
                    />
                    
                    <span className="w-12 text-center font-medium text-foreground">
                      {item?.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      onClick={() => onUpdateQuantity(item?.id, item?.quantity + 1)}
                      disabled={item?.quantity >= item?.availableStock}
                      className="w-8 h-8 p-0"
                    />
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatPrice(item?.price * item?.quantity)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item?.availableStock - item?.quantity} left
                    </div>
                  </div>
                </div>
                
                {/* Stock Warning */}
                {item?.quantity >= item?.availableStock && (
                  <div className="flex items-center space-x-2 mt-2 p-2 bg-warning/10 rounded-md">
                    <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
                    <span className="text-xs text-warning">
                      Maximum stock reached
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Cart Summary */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%):</span>
            <span className="font-medium text-foreground">{formatPrice(tax)}</span>
          </div>
          
          <div className="border-t border-border pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-foreground">Total:</span>
              <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;