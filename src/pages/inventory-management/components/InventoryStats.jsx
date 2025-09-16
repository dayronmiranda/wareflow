import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStats = ({ 
  stats, 
  selectedWarehouse, 
  warehouses 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getWarehouseName = () => {
    if (selectedWarehouse === 'all') return 'All Warehouses';
    const warehouse = warehouses?.find(w => w?.id === selectedWarehouse);
    return warehouse ? warehouse?.name : 'Unknown Warehouse';
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString(),
      icon: 'Package',
      color: 'text-primary',
      bg: 'bg-primary/10',
      change: stats?.productChange,
      changeType: stats?.productChange >= 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Total Stock Value',
      value: formatCurrency(stats?.totalValue),
      icon: 'DollarSign',
      color: 'text-success',
      bg: 'bg-success/10',
      change: stats?.valueChange,
      changeType: stats?.valueChange >= 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems?.toLocaleString(),
      icon: 'AlertTriangle',
      color: 'text-warning',
      bg: 'bg-warning/10',
      change: stats?.lowStockChange,
      changeType: stats?.lowStockChange <= 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStockItems?.toLocaleString(),
      icon: 'XCircle',
      color: 'text-error',
      bg: 'bg-error/10',
      change: stats?.outOfStockChange,
      changeType: stats?.outOfStockChange <= 0 ? 'increase' : 'decrease'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {getWarehouseName()} • Last updated: {new Date()?.toLocaleDateString('es-CU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat?.bg} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} color={`var(--color-${stat?.color?.split('-')?.[1]})`} />
              </div>
              {stat?.change !== undefined && (
                <div className={`flex items-center space-x-1 text-xs ${
                  stat?.changeType === 'increase' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={stat?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                  />
                  <span>{Math.abs(stat?.change)}%</span>
                </div>
              )}
            </div>
            
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat?.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat?.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="PieChart" size={20} className="mr-2" />
            Stock Status Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">In Stock</span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {stats?.inStockItems} ({((stats?.inStockItems / stats?.totalProducts) * 100)?.toFixed(1)}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm text-muted-foreground">Low Stock</span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {stats?.lowStockItems} ({((stats?.lowStockItems / stats?.totalProducts) * 100)?.toFixed(1)}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-sm text-muted-foreground">Out of Stock</span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {stats?.outOfStockItems} ({((stats?.outOfStockItems / stats?.totalProducts) * 100)?.toFixed(1)}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-sm text-muted-foreground">Overstock</span>
              </div>
              <div className="text-sm font-medium text-foreground">
                {stats?.overstockItems} ({((stats?.overstockItems / stats?.totalProducts) * 100)?.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="BarChart3" size={20} className="mr-2" />
            Top Categories by Value
          </h3>
          <div className="space-y-3">
            {stats?.topCategories?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs font-medium text-primary">
                    {index + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">{category?.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {formatCurrency(category?.value)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category?.products} products
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;