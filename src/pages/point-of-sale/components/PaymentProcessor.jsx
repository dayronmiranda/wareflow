import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentProcessor = ({ 
  totalAmount, 
  onPaymentComplete, 
  isProcessing = false,
  disabled = false 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [change, setChange] = useState(0);
  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  useEffect(() => {
    if (paymentMethod === 'cash' && cashReceived) {
      const received = parseFloat(cashReceived) || 0;
      const changeAmount = received - totalAmount;
      setChange(Math.max(0, changeAmount));
      
      // Clear error if payment is sufficient
      if (received >= totalAmount && errors?.cashReceived) {
        setErrors(prev => ({ ...prev, cashReceived: '' }));
      }
    } else {
      setChange(0);
    }
  }, [cashReceived, totalAmount, paymentMethod, errors?.cashReceived]);

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentMethod === 'cash') {
      const received = parseFloat(cashReceived) || 0;
      
      if (!cashReceived || received <= 0) {
        newErrors.cashReceived = 'Please enter the cash amount received';
      } else if (received < totalAmount) {
        newErrors.cashReceived = `Insufficient payment. Need ${formatPrice(totalAmount - received)} more`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleCompletePayment = () => {
    if (validatePayment()) {
      const paymentData = {
        method: paymentMethod,
        totalAmount,
        ...(paymentMethod === 'cash' && {
          cashReceived: parseFloat(cashReceived),
          change
        }),
        timestamp: new Date()?.toISOString(),
        invoiceNumber: `INV-${Date.now()}`
      };
      
      onPaymentComplete(paymentData);
    }
  };

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      icon: 'Banknote',
      description: 'Cuban Peso (CUP)'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="CreditCard" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Payment</h3>
      </div>
      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        <label className="text-sm font-medium text-foreground">Payment Method</label>
        {paymentMethods?.map((method) => (
          <button
            key={method?.id}
            onClick={() => setPaymentMethod(method?.id)}
            disabled={disabled}
            className={`w-full flex items-center space-x-3 p-3 rounded-md border transition-colors duration-150 ease-out ${
              paymentMethod === method?.id
                ? 'border-primary bg-primary/5 text-primary' :'border-border hover:bg-muted text-foreground'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon name={method?.icon} size={20} />
            <div className="text-left">
              <div className="font-medium">{method?.name}</div>
              <div className="text-sm opacity-75">{method?.description}</div>
            </div>
            {paymentMethod === method?.id && (
              <Icon name="Check" size={16} className="ml-auto" />
            )}
          </button>
        ))}
      </div>
      {/* Cash Payment Details */}
      {paymentMethod === 'cash' && (
        <div className="space-y-4 mb-6">
          <div className="bg-muted/30 rounded-md p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount:</span>
              <span className="text-lg font-bold text-foreground">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
          
          <Input
            label="Cash Received"
            type="number"
            placeholder="0.00"
            value={cashReceived}
            onChange={(e) => setCashReceived(e?.target?.value)}
            error={errors?.cashReceived}
            disabled={disabled}
            min="0"
            step="0.01"
          />
          
          {cashReceived && parseFloat(cashReceived) >= totalAmount && (
            <div className="bg-success/10 border border-success/20 rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <span className="text-sm font-medium text-success">Change to Return:</span>
                </div>
                <span className="text-lg font-bold text-success">
                  {formatPrice(change)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Quick Cash Amounts */}
      {paymentMethod === 'cash' && !disabled && (
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Quick Amounts
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              Math.ceil(totalAmount),
              Math.ceil(totalAmount / 100) * 100,
              Math.ceil(totalAmount / 500) * 500
            ]?.filter((amount, index, arr) => arr?.indexOf(amount) === index)?.sort((a, b) => a - b)?.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setCashReceived(amount?.toString())}
                className="text-xs"
              >
                {formatPrice(amount)}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Complete Payment Button */}
      <Button
        variant="default"
        fullWidth
        onClick={handleCompletePayment}
        disabled={disabled || isProcessing}
        loading={isProcessing}
        iconName="CreditCard"
        iconPosition="left"
        className="text-lg py-3"
      >
        {isProcessing ? 'Processing...' : `Complete Sale - ${formatPrice(totalAmount)}`}
      </Button>
      {/* Payment Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Invoice #:</span>
            <span>INV-{Date.now()}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date()?.toLocaleDateString('es-CU')}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{new Date()?.toLocaleTimeString('es-CU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;