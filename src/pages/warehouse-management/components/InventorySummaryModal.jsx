import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventorySummaryModal = ({ isOpen, onClose, warehouse }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock inventory data
  const inventoryData = {
    overview: {
      totalProducts: 156,
      totalValue: 45750,
      lowStockItems: 12,
      outOfStockItems: 3,
      categories: [
        { name: 'Electronics', count: 45, value: 25600 },
        { name: 'Clothing', count: 67, value: 12300 },
        { name: 'Home & Garden', count: 28, value: 5400 },
        { name: 'Sports', count: 16, value: 2450 }
      ]
    },
    recentActivity: [
      {
        id: 1,
        type: 'sale',
        product: 'Samsung Galaxy A54',
        quantity: 2,
        timestamp: '2025-01-16 14:30',
        user: 'Carlos Martinez'
      },
      {
        id: 2,
        type: 'restock',
        product: 'Nike Air Max',
        quantity: 15,
        timestamp: '2025-01-16 11:15',
        user: 'Maria Rodriguez'
      },
      {
        id: 3,
        type: 'transfer_out',
        product: 'HP Laptop',
        quantity: 3,
        timestamp: '2025-01-16 09:45',
        user: 'System'
      }
    ],
    pendingTransfers: [
      {
        id: 'TR-001',
        type: 'incoming',
        fromWarehouse: 'Central Warehouse',
        products: 5,
        estimatedArrival: '2025-01-17',
        status: 'in_transit'
      },
      {
        id: 'TR-002',
        type: 'outgoing',
        toWarehouse: 'North Branch',
        products: 3,
        requestedDate: '2025-01-18',
        status: 'pending_approval'
      }
    ]
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      sale: 'ShoppingCart',
      restock: 'Package',
      transfer_in: 'ArrowDown',
      transfer_out: 'ArrowUp',
      adjustment: 'Edit'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      sale: 'text-success',
      restock: 'text-primary',
      transfer_in: 'text-accent',
      transfer_out: 'text-warning',
      adjustment: 'text-secondary'
    };
    return colorMap?.[type] || 'text-muted-foreground';
  };

  const getTransferStatusBadge = (status) => {
    const statusConfig = {
      pending_approval: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending Approval' },
      in_transit: { bg: 'bg-primary/10', text: 'text-primary', label: 'In Transit' },
      completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending_approval;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'activity', label: 'Recent Activity', icon: 'Activity' },
    { id: 'transfers', label: 'Pending Transfers', icon: 'ArrowRightLeft' }
  ];

  if (!isOpen || !warehouse) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Inventory Summary</h2>
              <p className="text-sm text-muted-foreground">{warehouse?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Package" size={16} color="var(--color-primary)" />
                    <span className="text-sm font-medium text-muted-foreground">Total Products</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{inventoryData?.overview?.totalProducts}</div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="DollarSign" size={16} color="var(--color-success)" />
                    <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {inventoryData?.overview?.totalValue?.toLocaleString()} CUP
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                    <span className="text-sm font-medium text-muted-foreground">Low Stock</span>
                  </div>
                  <div className="text-2xl font-bold text-warning">{inventoryData?.overview?.lowStockItems}</div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="XCircle" size={16} color="var(--color-error)" />
                    <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                  </div>
                  <div className="text-2xl font-bold text-error">{inventoryData?.overview?.outOfStockItems}</div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Inventory by Category</h3>
                <div className="space-y-3">
                  {inventoryData?.overview?.categories?.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="Tag" size={16} color="var(--color-primary)" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{category?.name}</div>
                          <div className="text-sm text-muted-foreground">{category?.count} products</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          {category?.value?.toLocaleString()} CUP
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {((category?.value / inventoryData?.overview?.totalValue) * 100)?.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Inventory Activity</h3>
              <div className="space-y-3">
                {inventoryData?.recentActivity?.map((activity) => (
                  <div key={activity?.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity?.type)} bg-current/10`}>
                      <Icon name={getActivityIcon(activity?.type)} size={16} className={getActivityColor(activity?.type)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">{activity?.product}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity?.type === 'sale' && `Sold ${activity?.quantity} units`}
                            {activity?.type === 'restock' && `Restocked ${activity?.quantity} units`}
                            {activity?.type === 'transfer_out' && `Transferred out ${activity?.quantity} units`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-foreground">{activity?.timestamp}</div>
                          <div className="text-xs text-muted-foreground">by {activity?.user}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Transfers Tab */}
          {activeTab === 'transfers' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Pending Transfers</h3>
              <div className="space-y-3">
                {inventoryData?.pendingTransfers?.map((transfer) => (
                  <div key={transfer?.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon 
                            name={transfer?.type === 'incoming' ? 'ArrowDown' : 'ArrowUp'} 
                            size={16} 
                            color="var(--color-primary)" 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Transfer {transfer?.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {transfer?.type === 'incoming' 
                              ? `From ${transfer?.fromWarehouse}` 
                              : `To ${transfer?.toWarehouse}`
                            }
                          </div>
                        </div>
                      </div>
                      {getTransferStatusBadge(transfer?.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Products: </span>
                        <span className="text-foreground font-medium">{transfer?.products}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {transfer?.type === 'incoming' ? 'Expected: ' : 'Requested: '}
                        </span>
                        <span className="text-foreground font-medium">
                          {transfer?.estimatedArrival || transfer?.requestedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            iconName="Download"
          >
            Export Report
          </Button>
          <Button
            variant="default"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventorySummaryModal;