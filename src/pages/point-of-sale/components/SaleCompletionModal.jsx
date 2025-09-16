import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SaleCompletionModal = ({ 
  isOpen, 
  onClose, 
  saleData, 
  onPrintReceipt, 
  onNewSale 
}) => {
  if (!isOpen || !saleData) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleString('es-CU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={24} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Sale Completed</h2>
                <p className="text-sm text-muted-foreground">
                  Invoice #{saleData?.invoiceNumber}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Sale Summary */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Customer Info */}
            {saleData?.customer && (
              <div className="bg-muted/30 rounded-md p-3">
                <h4 className="font-medium text-foreground mb-2">Customer</h4>
                <div className="text-sm text-muted-foreground">
                  <div>{saleData?.customer?.name}</div>
                  {saleData?.customer?.idCard && (
                    <div>ID: {saleData?.customer?.idCard}</div>
                  )}
                  {saleData?.customer?.phone && (
                    <div>Phone: {saleData?.customer?.phone}</div>
                  )}
                </div>
              </div>
            )}

            {/* Items Summary */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Items Purchased</h4>
              <div className="space-y-2">
                {saleData?.items?.map((item) => (
                  <div key={item?.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{item?.name}</div>
                      <div className="text-muted-foreground">
                        {item?.quantity} × {formatPrice(item?.price)}
                      </div>
                    </div>
                    <div className="font-medium text-foreground">
                      {formatPrice(item?.price * item?.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-muted/30 rounded-md p-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(saleData?.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%):</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(saleData?.tax)}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="font-bold text-primary text-lg">
                      {formatPrice(saleData?.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <div className="flex items-center space-x-2">
                <Icon name="Banknote" size={16} />
                <span className="font-medium text-foreground capitalize">
                  {saleData?.paymentMethod}
                </span>
              </div>
            </div>

            {/* Cash Payment Details */}
            {saleData?.paymentMethod === 'cash' && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Received:</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(saleData?.cashReceived)}
                  </span>
                </div>
                {saleData?.change > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Change:</span>
                    <span className="font-medium text-success">
                      {formatPrice(saleData?.change)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Transaction Details */}
            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{formatDate(saleData?.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Warehouse:</span>
                <span>Main Warehouse</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>Current User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Printer"
              iconPosition="left"
              onClick={onPrintReceipt}
            >
              Print Receipt
            </Button>
            <Button
              variant="default"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              onClick={onNewSale}
            >
              New Sale
            </Button>
          </div>
          
          <div className="mt-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleCompletionModal;