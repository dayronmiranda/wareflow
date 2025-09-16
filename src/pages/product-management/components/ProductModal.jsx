import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductModal = ({ isOpen, onClose, product, onSave, warehouses }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    globalPrice: '',
    isActive: true,
    warehousePrices: {},
    inventoryLevels: {}
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'tools', label: 'Tools & Hardware' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'books', label: 'Books & Media' },
    { value: 'sports', label: 'Sports & Recreation' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        description: product?.description || '',
        category: product?.category || '',
        globalPrice: product?.globalPrice?.toString() || '',
        isActive: product?.isActive !== undefined ? product?.isActive : true,
        warehousePrices: product?.warehousePrices || {},
        inventoryLevels: product?.inventoryLevels || {}
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        sku: '',
        description: '',
        category: '',
        globalPrice: '',
        isActive: true,
        warehousePrices: {},
        inventoryLevels: {}
      });
    }
    setErrors({});
    setActiveTab('basic');
  }, [product, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleWarehousePriceChange = (warehouseId, price) => {
    setFormData(prev => ({
      ...prev,
      warehousePrices: {
        ...prev?.warehousePrices,
        [warehouseId]: price
      }
    }));
  };

  const handleInventoryChange = (warehouseId, quantity) => {
    setFormData(prev => ({
      ...prev,
      inventoryLevels: {
        ...prev?.inventoryLevels,
        [warehouseId]: Math.max(0, parseInt(quantity) || 0)
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData?.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.globalPrice || parseFloat(formData?.globalPrice) <= 0) {
      newErrors.globalPrice = 'Valid global price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const productData = {
      ...formData,
      globalPrice: parseFloat(formData?.globalPrice),
      id: product?.id || Date.now()?.toString()
    };

    onSave(productData);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 2
    })?.format(price || 0);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: 'Package' },
    { id: 'pricing', label: 'Warehouse Pricing', icon: 'DollarSign' },
    { id: 'inventory', label: 'Inventory Levels', icon: 'BarChart3' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {product ? `Editing ${product?.name}` : 'Create a new product in your catalog'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Product Name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                />

                <Input
                  label="SKU"
                  type="text"
                  placeholder="Enter SKU"
                  value={formData?.sku}
                  onChange={(e) => handleInputChange('sku', e?.target?.value)}
                  error={errors?.sku}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData?.category}
                  onChange={(value) => handleInputChange('category', value)}
                  placeholder="Select category"
                  error={errors?.category}
                  required
                />

                <Input
                  label="Global Price (CUP)"
                  type="number"
                  placeholder="0.00"
                  value={formData?.globalPrice}
                  onChange={(e) => handleInputChange('globalPrice', e?.target?.value)}
                  error={errors?.globalPrice}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <Input
                label="Description"
                type="text"
                placeholder="Enter product description"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />

              <Checkbox
                label="Active Product"
                description="Inactive products won't appear in sales or inventory"
                checked={formData?.isActive}
                onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
              />
            </div>
          )}

          {/* Warehouse Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} color="var(--color-primary)" />
                  <h3 className="font-medium text-foreground">Global Price</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Base price: {formatPrice(parseFloat(formData?.globalPrice) || 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Set warehouse-specific prices below. Leave empty to use global price.
                </p>
              </div>

              <div className="space-y-4">
                {warehouses?.map((warehouse) => (
                  <div key={warehouse?.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Icon name="Building" size={16} color="var(--color-muted-foreground)" />
                        <div>
                          <h4 className="font-medium text-foreground">{warehouse?.name}</h4>
                          <p className="text-sm text-muted-foreground">{warehouse?.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="font-medium text-foreground">
                          {formatPrice(formData?.warehousePrices?.[warehouse?.id] || formData?.globalPrice)}
                        </p>
                      </div>
                    </div>

                    <Input
                      label="Override Price (CUP)"
                      type="number"
                      placeholder={`Default: ${formatPrice(parseFloat(formData?.globalPrice) || 0)}`}
                      value={formData?.warehousePrices?.[warehouse?.id] || ''}
                      onChange={(e) => handleWarehousePriceChange(warehouse?.id, e?.target?.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Levels Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="BarChart3" size={16} color="var(--color-primary)" />
                  <h3 className="font-medium text-foreground">Inventory Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set initial stock levels for each warehouse. Quantities cannot be negative.
                </p>
              </div>

              <div className="space-y-4">
                {warehouses?.map((warehouse) => (
                  <div key={warehouse?.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Icon name="Building" size={16} color="var(--color-muted-foreground)" />
                        <div>
                          <h4 className="font-medium text-foreground">{warehouse?.name}</h4>
                          <p className="text-sm text-muted-foreground">{warehouse?.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="font-medium text-foreground">
                          {formData?.inventoryLevels?.[warehouse?.id] || 0} units
                        </p>
                      </div>
                    </div>

                    <Input
                      label="Stock Quantity"
                      type="number"
                      placeholder="0"
                      value={formData?.inventoryLevels?.[warehouse?.id] || ''}
                      onChange={(e) => handleInventoryChange(warehouse?.id, e?.target?.value)}
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {product ? 'Last updated: ' + new Date()?.toLocaleDateString('es-CU') : 'Creating new product'}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;