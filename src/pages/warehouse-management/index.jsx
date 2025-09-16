import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WarehouseTable from './components/WarehouseTable';
import WarehouseFilters from './components/WarehouseFilters';
import WarehouseModal from './components/WarehouseModal';
import BulkActionsBar from './components/BulkActionsBar';
import InventorySummaryModal from './components/InventorySummaryModal';
import TransferHistoryModal from './components/TransferHistoryModal';

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockWarehouses = [
    {
      id: 'WH-001',
      name: 'Central Warehouse',
      location: 'havana',
      address: 'Calle 23 #456, Vedado, Havana',
      phone: '+53 78901234',
      email: 'central@wareflow.cu',
      manager: 'Carlos Martinez',
      managerEmail: 'carlos.martinez@wareflow.cu',
      managerId: 'MGR-001',
      status: 'active',
      inventoryValue: 125750,
      totalProducts: 234,
      capacity: '2500',
      lastActivity: '16/01/2025 14:30',
      operatingHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '14:00', closed: false },
        sunday: { open: '08:00', close: '14:00', closed: true }
      }
    },
    {
      id: 'WH-002',
      name: 'North Branch',
      location: 'santiago',
      address: 'Avenida Victoriano Garzón #789, Santiago de Cuba',
      phone: '+53 78901235',
      email: 'north@wareflow.cu',
      manager: 'Maria Rodriguez',
      managerEmail: 'maria.rodriguez@wareflow.cu',
      managerId: 'MGR-002',
      status: 'active',
      inventoryValue: 89320,
      totalProducts: 156,
      capacity: '1800',
      lastActivity: '16/01/2025 11:15',
      operatingHours: {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '08:00', close: '13:00', closed: false },
        sunday: { open: '08:00', close: '13:00', closed: true }
      }
    },
    {
      id: 'WH-003',
      name: 'South Branch',
      location: 'camaguey',
      address: 'Calle República #321, Camagüey',
      phone: '+53 78901236',
      email: 'south@wareflow.cu',
      manager: 'Luis Fernandez',
      managerEmail: 'luis.fernandez@wareflow.cu',
      managerId: 'MGR-003',
      status: 'maintenance',
      inventoryValue: 45680,
      totalProducts: 87,
      capacity: '1200',
      lastActivity: '15/01/2025 16:45',
      operatingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '12:00', closed: false },
        sunday: { open: '09:00', close: '12:00', closed: true }
      }
    },
    {
      id: 'WH-004',
      name: 'East Branch',
      location: 'holguin',
      address: 'Calle Libertad #654, Holguín',
      phone: '+53 78901237',
      email: 'east@wareflow.cu',
      manager: 'Ana Garcia',
      managerEmail: 'ana.garcia@wareflow.cu',
      managerId: 'MGR-004',
      status: 'active',
      inventoryValue: 67890,
      totalProducts: 123,
      capacity: '1500',
      lastActivity: '16/01/2025 09:20',
      operatingHours: {
        monday: { open: '08:30', close: '17:30', closed: false },
        tuesday: { open: '08:30', close: '17:30', closed: false },
        wednesday: { open: '08:30', close: '17:30', closed: false },
        thursday: { open: '08:30', close: '17:30', closed: false },
        friday: { open: '08:30', close: '17:30', closed: false },
        saturday: { open: '08:30', close: '13:30', closed: false },
        sunday: { open: '08:30', close: '13:30', closed: true }
      }
    },
    {
      id: 'WH-005',
      name: 'West Branch',
      location: 'matanzas',
      address: 'Calle Medio #987, Matanzas',
      phone: '',
      email: 'west@wareflow.cu',
      manager: '',
      managerEmail: '',
      managerId: '',
      status: 'inactive',
      inventoryValue: 0,
      totalProducts: 0,
      capacity: '1000',
      lastActivity: '10/01/2025 14:00',
      operatingHours: {
        monday: { open: '08:00', close: '17:00', closed: true },
        tuesday: { open: '08:00', close: '17:00', closed: true },
        wednesday: { open: '08:00', close: '17:00', closed: true },
        thursday: { open: '08:00', close: '17:00', closed: true },
        friday: { open: '08:00', close: '17:00', closed: true },
        saturday: { open: '08:00', close: '17:00', closed: true },
        sunday: { open: '08:00', close: '17:00', closed: true }
      }
    }
  ];

  const mockManagers = [
    {
      id: 'MGR-001',
      name: 'Carlos Martinez',
      email: 'carlos.martinez@wareflow.cu',
      phone: '+53 78901234'
    },
    {
      id: 'MGR-002',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@wareflow.cu',
      phone: '+53 78901235'
    },
    {
      id: 'MGR-003',
      name: 'Luis Fernandez',
      email: 'luis.fernandez@wareflow.cu',
      phone: '+53 78901236'
    },
    {
      id: 'MGR-004',
      name: 'Ana Garcia',
      email: 'ana.garcia@wareflow.cu',
      phone: '+53 78901237'
    },
    {
      id: 'MGR-005',
      name: 'Pedro Sanchez',
      email: 'pedro.sanchez@wareflow.cu',
      phone: '+53 78901238'
    },
    {
      id: 'MGR-006',
      name: 'Sofia Martinez',
      email: 'sofia.martinez@wareflow.cu',
      phone: '+53 78901239'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setWarehouses(mockWarehouses);
      setFilteredWarehouses(mockWarehouses);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = warehouses;

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(warehouse =>
        warehouse?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        warehouse?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        warehouse?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        warehouse?.manager?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(warehouse => warehouse?.status === statusFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered?.filter(warehouse => warehouse?.location === locationFilter);
    }

    // Manager filter
    if (managerFilter !== 'all') {
      if (managerFilter === 'assigned') {
        filtered = filtered?.filter(warehouse => warehouse?.managerId);
      } else if (managerFilter === 'unassigned') {
        filtered = filtered?.filter(warehouse => !warehouse?.managerId);
      }
    }

    setFilteredWarehouses(filtered);
  }, [warehouses, searchTerm, statusFilter, locationFilter, managerFilter]);

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setIsWarehouseModalOpen(true);
  };

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsWarehouseModalOpen(true);
  };

  const handleViewInventory = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsInventoryModalOpen(true);
  };

  const handleViewTransfers = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsTransferModalOpen(true);
  };

  const handleSaveWarehouse = (warehouseData) => {
    if (selectedWarehouse) {
      // Update existing warehouse
      setWarehouses(prev => prev?.map(w => 
        w?.id === selectedWarehouse?.id 
          ? { ...w, ...warehouseData, id: selectedWarehouse?.id }
          : w
      ));
    } else {
      // Add new warehouse
      const newWarehouse = {
        ...warehouseData,
        id: `WH-${String(warehouses?.length + 1)?.padStart(3, '0')}`,
        inventoryValue: 0,
        totalProducts: 0,
        lastActivity: new Date()?.toLocaleDateString('en-GB') + ' ' + new Date()?.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      setWarehouses(prev => [...prev, newWarehouse]);
    }
    setIsWarehouseModalOpen(false);
    setSelectedWarehouse(null);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setWarehouses(prev => prev?.map(w => 
          selectedWarehouses?.includes(w?.id) ? { ...w, status: 'active' } : w
        ));
        break;
      case 'deactivate':
        setWarehouses(prev => prev?.map(w => 
          selectedWarehouses?.includes(w?.id) ? { ...w, status: 'inactive' } : w
        ));
        break;
      case 'maintenance':
        setWarehouses(prev => prev?.map(w => 
          selectedWarehouses?.includes(w?.id) ? { ...w, status: 'maintenance' } : w
        ));
        break;
      case 'export':
        console.log('Exporting selected warehouses:', selectedWarehouses);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete the selected warehouses? This action cannot be undone.')) {
          setWarehouses(prev => prev?.filter(w => !selectedWarehouses?.includes(w?.id)));
        }
        break;
      default:
        break;
    }
    setSelectedWarehouses([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setLocationFilter('all');
    setManagerFilter('all');
  };

  const getTotalStats = () => {
    const totalValue = warehouses?.reduce((sum, w) => sum + w?.inventoryValue, 0);
    const totalProducts = warehouses?.reduce((sum, w) => sum + w?.totalProducts, 0);
    const activeWarehouses = warehouses?.filter(w => w?.status === 'active')?.length;
    
    return { totalValue, totalProducts, activeWarehouses };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading warehouse data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Warehouse Management - WareFlow</title>
        <meta name="description" content="Manage warehouse locations, assign managers, and control operational settings" />
      </Helmet>
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Warehouse Management</h1>
                <p className="text-muted-foreground mt-2">
                  Configure warehouse locations, assign managers, and control operational settings
                </p>
              </div>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddWarehouse}
              >
                Add Warehouse
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Building" size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{warehouses?.length}</div>
                    <div className="text-sm text-muted-foreground">Total Warehouses</div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} color="var(--color-success)" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats?.activeWarehouses}</div>
                    <div className="text-sm text-muted-foreground">Active Warehouses</div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Package" size={24} color="var(--color-accent)" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats?.totalProducts?.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Products</div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" size={24} color="var(--color-warning)" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {stats?.totalValue?.toLocaleString()} CUP
                    </div>
                    <div className="text-sm text-muted-foreground">Total Inventory Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <WarehouseFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            locationFilter={locationFilter}
            onLocationFilterChange={setLocationFilter}
            managerFilter={managerFilter}
            onManagerFilterChange={setManagerFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedCount={selectedWarehouses?.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedWarehouses([])}
          />

          {/* Warehouse Table */}
          <WarehouseTable
            warehouses={filteredWarehouses}
            onEdit={handleEditWarehouse}
            onViewInventory={handleViewInventory}
            onViewTransfers={handleViewTransfers}
            selectedWarehouses={selectedWarehouses}
            onSelectionChange={setSelectedWarehouses}
            onStatusChange={(warehouseId, newStatus) => {
              setWarehouses(prev => prev?.map(w => 
                w?.id === warehouseId ? { ...w, status: newStatus } : w
              ));
            }}
          />

          {/* Empty State */}
          {filteredWarehouses?.length === 0 && !loading && (
            <div className="text-center py-12">
              <Icon name="Building" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No warehouses found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || managerFilter !== 'all' ? 'Try adjusting your filters to see more results.' : 'Get started by adding your first warehouse.'}
              </p>
              {(!searchTerm && statusFilter === 'all' && locationFilter === 'all' && managerFilter === 'all') && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddWarehouse}
                >
                  Add Your First Warehouse
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => {
          setIsWarehouseModalOpen(false);
          setSelectedWarehouse(null);
        }}
        warehouse={selectedWarehouse}
        onSave={handleSaveWarehouse}
        managers={mockManagers}
      />
      <InventorySummaryModal
        isOpen={isInventoryModalOpen}
        onClose={() => {
          setIsInventoryModalOpen(false);
          setSelectedWarehouse(null);
        }}
        warehouse={selectedWarehouse}
      />
      <TransferHistoryModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedWarehouse(null);
        }}
        warehouse={selectedWarehouse}
      />
    </div>
  );
};

export default WarehouseManagement;