import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockAdjustmentModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSave,
  userRole 
}) => {
  const [adjustmentData, setAdjustmentData] = useState({
    adjustmentType: 'add',
    quantity: '',
    reason: '',
    notes: '',
    costPrice: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  const adjustmentReasons = [
    { value: 'stock-count', label: 'Physical Stock Count' },
    { value: 'damage', label: 'Damaged Goods' },
    { value: 'expired', label: 'Expired Products' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'supplier-return', label: 'Return to Supplier' },
    { value: 'customer-return', label: 'Customer Return' },
    { value: 'transfer-in', label: 'Transfer In' },
    { value: 'transfer-out', label: 'Transfer Out' },
    { value: 'production', label: 'Production Adjustment' },
    { value: 'other', label: 'Other' }
  ];

  const adjustmentTypes = [
    { value: 'add', label: 'Add Stock (+)' },
    { value: 'remove', label: 'Remove Stock (-)' },
    { value: 'set', label: 'Set Exact Amount' }
  ];

  useEffect(() => {
    if (product) {
      setAdjustmentData({
        adjustmentType: 'add',
        quantity: '',
        reason: '',
        notes: '',
        costPrice: product?.costPrice?.toString() || '',
        location: product?.location || ''
      });
      setErrors({});
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setAdjustmentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!adjustmentData?.quantity || adjustmentData?.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!adjustmentData?.reason) {
      newErrors.reason = 'Please select a reason for adjustment';
    }

    if (adjustmentData?.adjustmentType === 'remove' && 
        parseInt(adjustmentData?.quantity) > product?.currentStock) {
      newErrors.quantity = `Cannot remove more than current stock (${product?.currentStock})`;
    }

    if (adjustmentData?.reason === 'other' && !adjustmentData?.notes?.trim()) {
      newErrors.notes = 'Please provide details when selecting "Other" reason';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const calculateNewStock = () => {
    const currentStock = product?.currentStock || 0;
    const quantity = parseInt(adjustmentData?.quantity) || 0;

    switch (adjustmentData?.adjustmentType) {
      case 'add':
        return currentStock + quantity;
      case 'remove':
        return Math.max(0, currentStock - quantity);
      case 'set':
        return quantity;
      default:
        return currentStock;
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const adjustmentRecord = {
      productId: product?.id,
      productName: product?.productName,
      sku: product?.sku,
      adjustmentType: adjustmentData?.adjustmentType,
      quantity: parseInt(adjustmentData?.quantity),
      previousStock: product?.currentStock,
      newStock: calculateNewStock(),
      reason: adjustmentData?.reason,
      notes: adjustmentData?.notes,
      costPrice: parseFloat(adjustmentData?.costPrice) || product?.costPrice,
      location: adjustmentData?.location || product?.location,
      timestamp: new Date()?.toISOString(),
      adjustedBy: userRole === 'owner' ? 'System Owner' : 'Warehouse Manager'
    };

    onSave(adjustmentRecord);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Stock Adjustment</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {product?.productName} ({product?.sku})
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Stock Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Stock:</span>
                <span className="ml-2 font-medium text-foreground">
                  {product?.currentStock} {product?.unit}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Reserved:</span>
                <span className="ml-2 font-medium text-warning">
                  {product?.reservedStock} {product?.unit}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <span className="ml-2 font-medium text-success">
                  {product?.availableStock} {product?.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Adjustment Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Adjustment Type"
                options={adjustmentTypes}
                value={adjustmentData?.adjustmentType}
                onChange={(value) => handleInputChange('adjustmentType', value)}
                required
              />
            </div>
            <div>
              <Input
                type="number"
                label={`Quantity (${product?.unit})`}
                placeholder="Enter quantity"
                value={adjustmentData?.quantity}
                onChange={(e) => handleInputChange('quantity', e?.target?.value)}
                error={errors?.quantity}
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <Select
              label="Reason for Adjustment"
              options={adjustmentReasons}
              value={adjustmentData?.reason}
              onChange={(value) => handleInputChange('reason', value)}
              error={errors?.reason}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                label="Cost Price (CUP)"
                placeholder="0.00"
                value={adjustmentData?.costPrice}
                onChange={(e) => handleInputChange('costPrice', e?.target?.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Input
                type="text"
                label="Storage Location"
                placeholder="e.g., A1-B2-C3"
                value={adjustmentData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
              />
            </div>
          </div>

          <div>
            <Input
              type="textarea"
              label="Additional Notes"
              placeholder="Enter any additional notes or comments..."
              value={adjustmentData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              error={errors?.notes}
              rows={3}
            />
          </div>

          {/* Preview */}
          {adjustmentData?.quantity && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Calculator" size={16} color="var(--color-accent)" />
                <span className="font-medium text-accent">Adjustment Preview</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="text-foreground">{product?.currentStock} {product?.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {adjustmentData?.adjustmentType === 'add' ? 'Adding:' : 
                     adjustmentData?.adjustmentType === 'remove' ? 'Removing:' : 'Setting to:'}
                  </span>
                  <span className="text-foreground font-medium">
                    {adjustmentData?.quantity} {product?.unit}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-accent/20">
                  <span className="text-muted-foreground">New Stock:</span>
                  <span className="text-accent font-medium">
                    {calculateNewStock()} {product?.unit}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Adjustment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;