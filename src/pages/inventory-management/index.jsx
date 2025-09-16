import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import InventoryStats from './components/InventoryStats';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import StockHistoryModal from './components/StockHistoryModal';
import BulkImportModal from './components/BulkImportModal';

const InventoryManagement = () => {
  const [userRole] = useState('owner'); // Mock user role
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    warehouse: 'all',
    category: 'all',
    stockStatus: 'all',
    minStock: '',
    maxStock: '',
    updatedAfter: '',
    updatedBefore: ''
  });

  // Modal states
  const [adjustmentModal, setAdjustmentModal] = useState({ isOpen: false, product: null });
  const [historyModal, setHistoryModal] = useState({ isOpen: false, product: null });
  const [bulkImportModal, setBulkImportModal] = useState(false);

  // Mock data
  const warehouses = [
    { id: 'wh-001', name: 'Main Warehouse', location: 'Havana Central', manager: 'Carlos Rodriguez' },
    { id: 'wh-002', name: 'North Branch', location: 'Havana North', manager: 'Maria Gonzalez' },
    { id: 'wh-003', name: 'South Branch', location: 'Havana South', manager: 'Jose Martinez' }
  ];

  const categories = ['Grains', 'Oils', 'Legumes', 'Dairy', 'Meat', 'Vegetables', 'Fruits', 'Beverages', 'Cleaning', 'Personal Care'];

  const mockInventory = [
    {
      id: 'inv-001',
      productName: 'Rice 5kg',
      sku: 'RICE-5KG',
      currentStock: 150,
      reservedStock: 25,
      availableStock: 125,
      unit: 'kg',
      minThreshold: 50,
      maxThreshold: 300,
      reorderPoint: 75,
      costPrice: 45.50,
      sellingPrice: 55.00,
      stockValue: 6825.00,
      category: 'Grains',
      warehouseId: 'wh-001',
      warehouseName: 'Main Warehouse',
      location: 'A1-B2-C1',
      lastUpdated: '2025-01-15T14:30:00Z'
    },
    {
      id: 'inv-002',
      productName: 'Cooking Oil 1L',
      sku: 'OIL-1L',
      currentStock: 35,
      reservedStock: 10,
      availableStock: 25,
      unit: 'liter',
      minThreshold: 40,
      maxThreshold: 120,
      reorderPoint: 50,
      costPrice: 85.00,
      sellingPrice: 95.00,
      stockValue: 2975.00,
      category: 'Oils',
      warehouseId: 'wh-001',
      warehouseName: 'Main Warehouse',
      location: 'A2-B1-C3',
      lastUpdated: '2025-01-15T12:15:00Z'
    },
    {
      id: 'inv-003',
      productName: 'Black Beans 1kg',
      sku: 'BEANS-1KG',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      unit: 'kg',
      minThreshold: 30,
      maxThreshold: 200,
      reorderPoint: 45,
      costPrice: 25.00,
      sellingPrice: 30.00,
      stockValue: 0.00,
      category: 'Legumes',
      warehouseId: 'wh-002',
      warehouseName: 'North Branch',
      location: 'B1-A2-C1',
      lastUpdated: '2025-01-14T16:45:00Z'
    },
    {
      id: 'inv-004',
      productName: 'Fresh Milk 1L',
      sku: 'MILK-1L',
      currentStock: 85,
      reservedStock: 15,
      availableStock: 70,
      unit: 'liter',
      minThreshold: 20,
      maxThreshold: 100,
      reorderPoint: 30,
      costPrice: 35.00,
      sellingPrice: 42.00,
      stockValue: 2975.00,
      category: 'Dairy',
      warehouseId: 'wh-001',
      warehouseName: 'Main Warehouse',
      location: 'C1-A1-B2',
      lastUpdated: '2025-01-15T09:20:00Z'
    },
    {
      id: 'inv-005',
      productName: 'Chicken Breast 1kg',
      sku: 'CHICKEN-1KG',
      currentStock: 220,
      reservedStock: 30,
      availableStock: 190,
      unit: 'kg',
      minThreshold: 50,
      maxThreshold: 150,
      reorderPoint: 75,
      costPrice: 120.00,
      sellingPrice: 140.00,
      stockValue: 26400.00,
      category: 'Meat',
      warehouseId: 'wh-003',
      warehouseName: 'South Branch',
      location: 'D1-B3-A2',
      lastUpdated: '2025-01-15T11:10:00Z'
    },
    {
      id: 'inv-006',
      productName: 'Tomatoes 1kg',
      sku: 'TOMATO-1KG',
      currentStock: 12,
      reservedStock: 5,
      availableStock: 7,
      unit: 'kg',
      minThreshold: 15,
      maxThreshold: 80,
      reorderPoint: 25,
      costPrice: 18.00,
      sellingPrice: 22.00,
      stockValue: 216.00,
      category: 'Vegetables',
      warehouseId: 'wh-002',
      warehouseName: 'North Branch',
      location: 'E1-C2-B1',
      lastUpdated: '2025-01-15T13:45:00Z'
    }
  ];

  const mockStockHistory = [
    {
      timestamp: '2025-01-15T14:30:00Z',
      type: 'adjustment',
      description: 'Stock adjustment - Physical count',
      stockChange: 25,
      stockAfter: 150,
      performedBy: 'Carlos Rodriguez',
      reference: 'ADJ-2025-001',
      notes: 'Physical inventory count adjustment',
      costPrice: 45.50,
      location: 'A1-B2-C1'
    },
    {
      timestamp: '2025-01-15T10:15:00Z',
      type: 'sale',
      description: 'Sale transaction',
      stockChange: -10,
      stockAfter: 125,
      performedBy: 'Maria Santos',
      reference: 'INV-2025-0234',
      notes: 'Regular customer purchase'
    },
    {
      timestamp: '2025-01-14T16:20:00Z',
      type: 'transfer-in',
      description: 'Transfer from North Branch',
      stockChange: 50,
      stockAfter: 135,
      performedBy: 'Jose Martinez',
      reference: 'TRF-2025-0045',
      notes: 'Warehouse rebalancing'
    },
    {
      timestamp: '2025-01-14T09:30:00Z',
      type: 'return',
      description: 'Customer return',
      stockChange: 3,
      stockAfter: 85,
      performedBy: 'Ana Lopez',
      reference: 'RET-2025-0012',
      notes: 'Product return - unopened package'
    },
    {
      timestamp: '2025-01-13T14:45:00Z',
      type: 'damage',
      description: 'Damaged goods removal',
      stockChange: -8,
      stockAfter: 82,
      performedBy: 'Carlos Rodriguez',
      reference: 'DMG-2025-0003',
      notes: 'Water damage during transport'
    }
  ];

  // Filter inventory based on current filters
  const filteredInventory = useMemo(() => {
    return mockInventory?.filter(item => {
      // Search filter
      if (filters?.search) {
        const searchTerm = filters?.search?.toLowerCase();
        if (!item?.productName?.toLowerCase()?.includes(searchTerm) && 
            !item?.sku?.toLowerCase()?.includes(searchTerm)) {
          return false;
        }
      }

      // Warehouse filter
      if (filters?.warehouse !== 'all' && item?.warehouseId !== filters?.warehouse) {
        return false;
      }

      // Category filter
      if (filters?.category !== 'all' && item?.category !== filters?.category) {
        return false;
      }

      // Stock status filter
      if (filters?.stockStatus !== 'all') {
        const stockStatus = getStockStatus(item);
        if (stockStatus !== filters?.stockStatus) {
          return false;
        }
      }

      // Stock level filters
      if (filters?.minStock && item?.currentStock < parseInt(filters?.minStock)) {
        return false;
      }
      if (filters?.maxStock && item?.currentStock > parseInt(filters?.maxStock)) {
        return false;
      }

      // Date filters
      if (filters?.updatedAfter) {
        const itemDate = new Date(item.lastUpdated);
        const filterDate = new Date(filters.updatedAfter);
        if (itemDate < filterDate) {
          return false;
        }
      }
      if (filters?.updatedBefore) {
        const itemDate = new Date(item.lastUpdated);
        const filterDate = new Date(filters.updatedBefore);
        if (itemDate > filterDate) {
          return false;
        }
      }

      return true;
    });
  }, [mockInventory, filters]);

  const getStockStatus = (item) => {
    if (item?.currentStock === 0) return 'out-of-stock';
    if (item?.currentStock <= item?.minThreshold) return 'low-stock';
    if (item?.currentStock >= item?.maxThreshold) return 'overstock';
    return 'in-stock';
  };

  // Calculate stats
  const stats = useMemo(() => {
    const inventory = filters?.warehouse === 'all' ? mockInventory : 
      mockInventory?.filter(item => item?.warehouseId === filters?.warehouse);

    const totalProducts = inventory?.length;
    const totalValue = inventory?.reduce((sum, item) => sum + item?.stockValue, 0);
    const lowStockItems = inventory?.filter(item => item?.currentStock <= item?.minThreshold && item?.currentStock > 0)?.length;
    const outOfStockItems = inventory?.filter(item => item?.currentStock === 0)?.length;
    const inStockItems = inventory?.filter(item => item?.currentStock > item?.minThreshold)?.length;
    const overstockItems = inventory?.filter(item => item?.currentStock >= item?.maxThreshold)?.length;

    // Mock category data
    const categoryStats = categories?.map(category => {
      const categoryItems = inventory?.filter(item => item?.category === category);
      return {
        name: category,
        products: categoryItems?.length,
        value: categoryItems?.reduce((sum, item) => sum + item?.stockValue, 0)
      };
    })?.sort((a, b) => b?.value - a?.value)?.slice(0, 5);

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      inStockItems,
      overstockItems,
      productChange: 5.2,
      valueChange: 12.8,
      lowStockChange: -15.3,
      outOfStockChange: -25.0,
      topCategories: categoryStats
    };
  }, [mockInventory, filters?.warehouse]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      warehouse: 'all',
      category: 'all',
      stockStatus: 'all',
      minStock: '',
      maxStock: '',
      updatedAfter: '',
      updatedBefore: ''
    });
  };

  const handleStockAdjustment = (product) => {
    setAdjustmentModal({ isOpen: true, product });
  };

  const handleViewHistory = (product) => {
    setHistoryModal({ isOpen: true, product });
  };

  const handleSaveAdjustment = (adjustmentData) => {
    console.log('Saving stock adjustment:', adjustmentData);
    // Here you would typically update the inventory and create an audit record
    setAdjustmentModal({ isOpen: false, product: null });
    
    // Show success message
    alert(`Stock adjustment saved successfully for ${adjustmentData?.productName}`);
  };

  const handleBulkImport = () => {
    setBulkImportModal(true);
  };

  const handleImportComplete = (results) => {
    console.log('Import completed:', results);
    setBulkImportModal(false);
    
    // Show success message
    alert(`Import completed: ${results?.successful} products imported successfully`);
  };

  // Update warehouse filter when user role is manager
  useEffect(() => {
    if (userRole === 'manager') {
      setFilters(prev => ({ ...prev, warehouse: 'wh-001' }));
      setSelectedWarehouse('wh-001');
    }
  }, [userRole]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionToolbar userRole={userRole} />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Stats Overview */}
          <InventoryStats 
            stats={stats}
            selectedWarehouse={selectedWarehouse}
            warehouses={warehouses}
          />

          {/* Filters */}
          <InventoryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            warehouses={warehouses}
            categories={categories}
            userRole={userRole}
            onClearFilters={handleClearFilters}
            onBulkImport={handleBulkImport}
          />

          {/* Inventory Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Inventory Items ({filteredInventory?.length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage stock levels and track inventory movements
                </p>
              </div>
            </div>

            <InventoryTable
              inventory={filteredInventory}
              selectedWarehouse={selectedWarehouse}
              onStockAdjustment={handleStockAdjustment}
              onViewHistory={handleViewHistory}
              userRole={userRole}
            />
          </div>
        </div>
      </main>
      {/* Modals */}
      <StockAdjustmentModal
        isOpen={adjustmentModal?.isOpen}
        onClose={() => setAdjustmentModal({ isOpen: false, product: null })}
        product={adjustmentModal?.product}
        onSave={handleSaveAdjustment}
        userRole={userRole}
      />
      <StockHistoryModal
        isOpen={historyModal?.isOpen}
        onClose={() => setHistoryModal({ isOpen: false, product: null })}
        product={historyModal?.product}
        stockHistory={mockStockHistory}
      />
      <BulkImportModal
        isOpen={bulkImportModal}
        onClose={() => setBulkImportModal(false)}
        onImport={handleImportComplete}
      />
    </div>
  );
};

export default InventoryManagement;