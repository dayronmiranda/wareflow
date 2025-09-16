import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProductFilters from './components/ProductFilters';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import BulkActionsBar from './components/BulkActionsBar';
import PriceHistoryModal from './components/PriceHistoryModal';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [priceHistoryProduct, setPriceHistoryProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    priceRange: { min: '', max: '' }
  });

  // Mock warehouses data
  const warehouses = [
    { id: 'warehouse-1', name: 'Main Warehouse', location: 'Downtown Havana' },
    { id: 'warehouse-2', name: 'North Branch', location: 'North District' },
    { id: 'warehouse-3', name: 'South Branch', location: 'South District' }
  ];

  // Mock products data
  const mockProducts = [
    {
      id: '1',
      name: 'Samsung Galaxy A54',
      sku: 'SAM-A54-128',
      description: 'Smartphone with 128GB storage, 6.4" display, and triple camera system',
      category: 'electronics',
      globalPrice: 450.00,
      isActive: true,
      warehousePrices: {
        'warehouse-1': 445.00,
        'warehouse-2': 455.00
      },
      inventoryLevels: {
        'warehouse-1': 25,
        'warehouse-2': 18,
        'warehouse-3': 12
      },
      totalStock: 55
    },
    {
      id: '2',
      name: 'Nike Air Max 270',
      sku: 'NIKE-AM270-42',
      description: 'Running shoes with Air Max cushioning, size 42',
      category: 'clothing',
      globalPrice: 120.00,
      isActive: true,
      warehousePrices: {},
      inventoryLevels: {
        'warehouse-1': 8,
        'warehouse-2': 5,
        'warehouse-3': 3
      },
      totalStock: 16
    },
    {
      id: '3',
      name: 'Café Cubano Premium',
      sku: 'CAFE-PREM-500G',
      description: 'Premium Cuban coffee beans, 500g package',
      category: 'food',
      globalPrice: 25.00,
      isActive: true,
      warehousePrices: {
        'warehouse-1': 24.00
      },
      inventoryLevels: {
        'warehouse-1': 150,
        'warehouse-2': 120,
        'warehouse-3': 80
      },
      totalStock: 350
    },
    {
      id: '4',
      name: 'Bosch Drill Set',
      sku: 'BOSCH-DRILL-18V',
      description: '18V cordless drill with battery and charger',
      category: 'tools',
      globalPrice: 180.00,
      isActive: false,
      warehousePrices: {},
      inventoryLevels: {
        'warehouse-1': 0,
        'warehouse-2': 2,
        'warehouse-3': 1
      },
      totalStock: 3
    },
    {
      id: '5',
      name: 'Havana Rum Añejo',
      sku: 'RUM-HAV-750ML',
      description: 'Premium aged Cuban rum, 750ml bottle',
      category: 'food',
      globalPrice: 35.00,
      isActive: true,
      warehousePrices: {
        'warehouse-2': 38.00,
        'warehouse-3': 36.00
      },
      inventoryLevels: {
        'warehouse-1': 45,
        'warehouse-2': 32,
        'warehouse-3': 28
      },
      totalStock: 105
    },
    {
      id: '6',
      name: 'Guayabera Tradicional',
      sku: 'GUAY-TRAD-L',
      description: 'Traditional Cuban guayabera shirt, size L, white cotton',
      category: 'clothing',
      globalPrice: 45.00,
      isActive: true,
      warehousePrices: {},
      inventoryLevels: {
        'warehouse-1': 12,
        'warehouse-2': 8,
        'warehouse-3': 6
      },
      totalStock: 26
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchTerm) ||
        product?.sku?.toLowerCase()?.includes(searchTerm) ||
        product?.description?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters?.category) {
      filtered = filtered?.filter(product => product?.category === filters?.category);
    }

    // Apply stock status filter
    if (filters?.stockStatus) {
      filtered = filtered?.filter(product => {
        switch (filters?.stockStatus) {
          case 'in-stock':
            return product?.totalStock > 10;
          case 'low-stock':
            return product?.totalStock > 0 && product?.totalStock <= 10;
          case 'out-of-stock':
            return product?.totalStock === 0;
          case 'overstocked':
            return product?.totalStock > 100;
          default:
            return true;
        }
      });
    }

    // Apply price range filter
    if (filters?.priceRange?.min || filters?.priceRange?.max) {
      filtered = filtered?.filter(product => {
        const price = product?.globalPrice;
        const min = parseFloat(filters?.priceRange?.min) || 0;
        const max = parseFloat(filters?.priceRange?.max) || Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, filters, sortConfig]);

  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedProducts([]); // Clear selection when filters change
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleProductDuplicate = (product) => {
    const duplicatedProduct = {
      ...product,
      id: Date.now()?.toString(),
      name: `${product?.name} (Copy)`,
      sku: `${product?.sku}-COPY`,
      totalStock: 0,
      inventoryLevels: Object.keys(product?.inventoryLevels)?.reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {})
    };
    setEditingProduct(duplicatedProduct);
    setIsProductModalOpen(true);
  };

  const handleViewPriceHistory = (product) => {
    setPriceHistoryProduct(product);
    setIsPriceHistoryModalOpen(true);
  };

  const handleProductSave = (productData) => {
    if (editingProduct && editingProduct?.id && products?.find(p => p?.id === editingProduct?.id)) {
      // Update existing product
      setProducts(prev => prev?.map(p => 
        p?.id === editingProduct?.id 
          ? { ...productData, totalStock: Object.values(productData?.inventoryLevels || {})?.reduce((sum, qty) => sum + qty, 0) }
          : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        totalStock: Object.values(productData?.inventoryLevels || {})?.reduce((sum, qty) => sum + qty, 0)
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setEditingProduct(null);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setProducts(prev => prev?.map(p => 
          selectedProducts?.includes(p?.id) ? { ...p, isActive: true } : p
        ));
        break;
      case 'deactivate':
        setProducts(prev => prev?.map(p => 
          selectedProducts?.includes(p?.id) ? { ...p, isActive: false } : p
        ));
        break;
      case 'export':
        console.log('Exporting products:', selectedProducts);
        break;
      case 'duplicate':
        const productsToduplicate = products?.filter(p => selectedProducts?.includes(p?.id));
        const duplicatedProducts = productsToduplicate?.map(product => ({
          ...product,
          id: `${product?.id}-copy-${Date.now()}`,
          name: `${product?.name} (Copy)`,
          sku: `${product?.sku}-COPY`,
          totalStock: 0,
          inventoryLevels: Object.keys(product?.inventoryLevels)?.reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {})
        }));
        setProducts(prev => [...prev, ...duplicatedProducts]);
        break;
      case 'delete':
        setProducts(prev => prev?.filter(p => !selectedProducts?.includes(p?.id)));
        break;
      default:
        break;
    }
    setSelectedProducts([]);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionToolbar userRole="manager" />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
                <p className="text-muted-foreground">
                  Manage your product catalog with global and warehouse-specific pricing
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => console.log('Import products')}
              >
                Import Products
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Filters */}
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            totalProducts={products?.length}
            filteredCount={filteredProducts?.length}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedCount={selectedProducts?.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedProducts([])}
          />

          {/* Products Table */}
          <ProductTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onSelectionChange={setSelectedProducts}
            onProductEdit={handleProductEdit}
            onProductDuplicate={handleProductDuplicate}
            onViewPriceHistory={handleViewPriceHistory}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Product Modal */}
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProduct(null);
            }}
            product={editingProduct}
            onSave={handleProductSave}
            warehouses={warehouses}
          />

          {/* Price History Modal */}
          <PriceHistoryModal
            isOpen={isPriceHistoryModalOpen}
            onClose={() => {
              setIsPriceHistoryModalOpen(false);
              setPriceHistoryProduct(null);
            }}
            product={priceHistoryProduct}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductManagement;