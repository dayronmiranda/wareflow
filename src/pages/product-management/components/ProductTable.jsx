import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectionChange, 
  onProductEdit, 
  onProductDuplicate, 
  onViewPriceHistory,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(products?.map(p => p?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts?.filter(id => id !== productId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStockStatusBadge = (totalStock) => {
    if (totalStock === 0) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">Out of Stock</span>;
    } else if (totalStock < 10) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">Low Stock</span>;
    } else if (totalStock > 100) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">Overstocked</span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">In Stock</span>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 2
    })?.format(price);
  };

  const isAllSelected = products?.length > 0 && selectedProducts?.length === products?.length;
  const isIndeterminate = selectedProducts?.length > 0 && selectedProducts?.length < products?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Product Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => onSort('sku')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>SKU</span>
                  <Icon name={getSortIcon('sku')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => onSort('category')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => onSort('globalPrice')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Global Price</span>
                  <Icon name={getSortIcon('globalPrice')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Total Stock</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
              <th className="text-center px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product?.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  selectedProducts?.includes(product?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(product?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedProducts?.includes(product?.id)}
                    onChange={(e) => handleSelectProduct(product?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={16} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{product?.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {product?.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">{product?.sku}</td>
                <td className="px-4 py-3 text-foreground">{product?.category}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatPrice(product?.globalPrice)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{product?.totalStock}</span>
                    {getStockStatusBadge(product?.totalStock)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product?.isActive 
                      ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {product?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onProductEdit(product)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      onClick={() => onProductDuplicate(product)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="TrendingUp"
                      onClick={() => onViewPriceHistory(product)}
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {products?.map((product) => (
          <div
            key={product?.id}
            className={`border border-border rounded-lg p-4 ${
              selectedProducts?.includes(product?.id) ? 'bg-primary/5 border-primary/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedProducts?.includes(product?.id)}
                  onChange={(e) => handleSelectProduct(product?.id, e?.target?.checked)}
                />
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="Package" size={20} color="var(--color-muted-foreground)" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{product?.name}</h3>
                  <p className="text-sm text-muted-foreground">{product?.sku}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                product?.isActive 
                  ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
              }`}>
                {product?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium text-foreground">{product?.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Global Price</p>
                <p className="text-sm font-medium text-foreground">{formatPrice(product?.globalPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Stock</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{product?.totalStock}</span>
                  {getStockStatusBadge(product?.totalStock)}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                onClick={() => onProductEdit(product)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Copy"
                onClick={() => onProductDuplicate(product)}
                className="px-3"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="TrendingUp"
                onClick={() => onViewPriceHistory(product)}
                className="px-3"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {products?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add a new product.</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;