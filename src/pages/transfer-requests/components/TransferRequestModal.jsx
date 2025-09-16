import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransferRequestModal = ({ isOpen, onClose, onSubmit, warehouses = [], products = [], currentWarehouse = 'Main Warehouse' }) => {
  const [formData, setFormData] = useState({
    destinationWarehouse: '',
    products: [],
    justification: ''
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});

  const mockProducts = [
    { id: 1, name: 'Laptop Dell Inspiron 15', sku: 'LAP-001', stock: 25, price: 850.00 },
    { id: 2, name: 'Wireless Mouse Logitech', sku: 'MOU-002', stock: 150, price: 35.50 },
    { id: 3, name: 'USB-C Cable 2m', sku: 'CAB-003', stock: 200, price: 15.75 },
    { id: 4, name: 'Monitor Samsung 24"', sku: 'MON-004', stock: 45, price: 320.00 },
    { id: 5, name: 'Keyboard Mechanical RGB', sku: 'KEY-005', stock: 80, price: 125.00 }
  ];

  const mockWarehouses = [
    { value: 'north-branch', label: 'North Branch', location: 'North District' },
    { value: 'south-branch', label: 'South Branch', location: 'South District' },
    { value: 'east-warehouse', label: 'East Warehouse', location: 'East District' },
    { value: 'west-depot', label: 'West Depot', location: 'West District' }
  ];

  const productOptions = (products?.length > 0 ? products : mockProducts)?.map(product => ({
    value: product?.id,
    label: `${product?.name} (${product?.sku}) - Stock: ${product?.stock}`,
    stock: product?.stock,
    disabled: product?.stock === 0
  }));

  const warehouseOptions = warehouses?.length > 0 ? warehouses : mockWarehouses;

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        destinationWarehouse: '',
        products: [],
        justification: ''
      });
      setSelectedProduct('');
      setQuantity('');
      setErrors({});
    }
  }, [isOpen]);

  const handleAddProduct = () => {
    if (!selectedProduct || !quantity) {
      setErrors({ product: 'Please select a product and enter quantity' });
      return;
    }

    const product = mockProducts?.find(p => p?.id === parseInt(selectedProduct));
    const requestedQty = parseInt(quantity);

    if (requestedQty > product?.stock) {
      setErrors({ product: `Insufficient stock. Available: ${product?.stock}` });
      return;
    }

    const existingProductIndex = formData?.products?.findIndex(p => p?.id === product?.id);
    
    if (existingProductIndex >= 0) {
      const updatedProducts = [...formData?.products];
      updatedProducts[existingProductIndex].quantity += requestedQty;
      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({
        ...formData,
        products: [...formData?.products, { ...product, quantity: requestedQty }]
      });
    }

    setSelectedProduct('');
    setQuantity('');
    setErrors({});
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData?.products?.filter(p => p?.id !== productId)
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const newErrors = {};
    if (!formData?.destinationWarehouse) newErrors.warehouse = 'Please select destination warehouse';
    if (formData?.products?.length === 0) newErrors.products = 'Please add at least one product';
    if (!formData?.justification?.trim()) newErrors.justification = 'Please provide justification';

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    const requestData = {
      id: `TR-${Date.now()}`,
      sourceWarehouse: currentWarehouse,
      destinationWarehouse: warehouseOptions?.find(w => w?.value === formData?.destinationWarehouse)?.label,
      products: formData?.products,
      justification: formData?.justification,
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'Current User'
    };

    onSubmit(requestData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create Transfer Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Warehouse
                </label>
                <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                  {currentWarehouse}
                </div>
              </div>

              <Select
                label="Destination Warehouse"
                placeholder="Select destination warehouse"
                options={warehouseOptions}
                value={formData?.destinationWarehouse}
                onChange={(value) => setFormData({ ...formData, destinationWarehouse: value })}
                error={errors?.warehouse}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Justification *
                </label>
                <textarea
                  value={formData?.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e?.target?.value })}
                  placeholder="Explain the reason for this transfer request..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors?.justification && (
                  <p className="text-sm text-error mt-1">{errors?.justification}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">Add Products</h3>
                
                <div className="space-y-3">
                  <Select
                    label="Select Product"
                    placeholder="Choose a product"
                    options={productOptions}
                    value={selectedProduct}
                    onChange={setSelectedProduct}
                    searchable
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e?.target?.value)}
                    min="1"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddProduct}
                    iconName="Plus"
                    iconPosition="left"
                    fullWidth
                  >
                    Add Product
                  </Button>

                  {errors?.product && (
                    <p className="text-sm text-error">{errors?.product}</p>
                  )}
                </div>
              </div>

              {/* Selected Products */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">
                  Selected Products ({formData?.products?.length})
                </h3>
                
                {formData?.products?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No products added yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData?.products?.map((product) => (
                      <div key={product?.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {product?.sku} • Qty: {product?.quantity}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product?.id)}
                          className="p-1 hover:bg-error/10 text-error rounded"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {errors?.products && (
                  <p className="text-sm text-error mt-2">{errors?.products}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" iconName="Send" iconPosition="left">
              Create Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferRequestModal;