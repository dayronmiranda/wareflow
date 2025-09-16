import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WarehouseTable = ({ warehouses, onEdit, onViewInventory, onViewTransfers, onStatusChange, selectedWarehouses, onSelectionChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedWarehouses = React.useMemo(() => {
    if (!sortConfig?.key) return warehouses;

    return [...warehouses]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (sortConfig?.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [warehouses, sortConfig]);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(warehouses?.map(w => w?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectWarehouse = (warehouseId, checked) => {
    if (checked) {
      onSelectionChange([...selectedWarehouses, warehouseId]);
    } else {
      onSelectionChange(selectedWarehouses?.filter(id => id !== warehouseId));
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      inactive: { bg: 'bg-error/10', text: 'text-error', label: 'Inactive' },
      maintenance: { bg: 'bg-warning/10', text: 'text-warning', label: 'Maintenance' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedWarehouses?.length === warehouses?.length && warehouses?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Warehouse</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Location</span>
                  <Icon name={getSortIcon('location')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('manager')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Manager</span>
                  <Icon name={getSortIcon('manager')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('inventoryValue')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Inventory Value</span>
                  <Icon name={getSortIcon('inventoryValue')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Last Activity</span>
                  <Icon name={getSortIcon('lastActivity')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedWarehouses?.map((warehouse) => (
              <tr key={warehouse?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedWarehouses?.includes(warehouse?.id)}
                    onChange={(e) => handleSelectWarehouse(warehouse?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Building" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{warehouse?.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {warehouse?.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{warehouse?.location}</div>
                  <div className="text-xs text-muted-foreground">{warehouse?.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} color="white" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground">{warehouse?.manager}</div>
                      <div className="text-xs text-muted-foreground">{warehouse?.managerEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(warehouse?.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {warehouse?.inventoryValue?.toLocaleString()} CUP
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {warehouse?.totalProducts} products
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{warehouse?.lastActivity}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEdit(warehouse)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Package"
                      onClick={() => onViewInventory(warehouse)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ArrowRightLeft"
                      onClick={() => onViewTransfers(warehouse)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedWarehouses?.map((warehouse) => (
          <div key={warehouse?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedWarehouses?.includes(warehouse?.id)}
                  onChange={(e) => handleSelectWarehouse(warehouse?.id, e?.target?.checked)}
                  className="rounded border-border"
                />
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Building" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{warehouse?.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {warehouse?.id}</div>
                </div>
              </div>
              {getStatusBadge(warehouse?.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">{warehouse?.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="User" size={14} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">Manager:</span>
                <span className="text-foreground">{warehouse?.manager}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="DollarSign" size={14} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">Value:</span>
                <span className="text-foreground font-medium">
                  {warehouse?.inventoryValue?.toLocaleString()} CUP
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Clock" size={14} color="var(--color-muted-foreground)" />
                <span className="text-muted-foreground">Last Activity:</span>
                <span className="text-foreground">{warehouse?.lastActivity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {warehouse?.totalProducts} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onEdit(warehouse)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Package"
                  onClick={() => onViewInventory(warehouse)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ArrowRightLeft"
                  onClick={() => onViewTransfers(warehouse)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseTable;