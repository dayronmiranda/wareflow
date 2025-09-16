import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransferHistoryModal = ({ isOpen, onClose, warehouse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock transfer history data
  const transferHistory = [
    {
      id: 'TR-2025-001',
      type: 'incoming',
      fromWarehouse: 'Central Warehouse',
      toWarehouse: warehouse?.name,
      products: [
        { name: 'Samsung Galaxy A54', quantity: 5 },
        { name: 'iPhone 15', quantity: 3 }
      ],
      totalItems: 8,
      requestDate: '2025-01-15',
      completedDate: '2025-01-16',
      status: 'completed',
      requestedBy: 'Maria Rodriguez',
      approvedBy: 'Carlos Martinez'
    },
    {
      id: 'TR-2025-002',
      type: 'outgoing',
      fromWarehouse: warehouse?.name,
      toWarehouse: 'North Branch',
      products: [
        { name: 'Nike Air Max', quantity: 10 },
        { name: 'Adidas Ultraboost', quantity: 8 }
      ],
      totalItems: 18,
      requestDate: '2025-01-14',
      completedDate: '2025-01-15',
      status: 'completed',
      requestedBy: 'Ana Garcia',
      approvedBy: 'Luis Fernandez'
    },
    {
      id: 'TR-2025-003',
      type: 'incoming',
      fromWarehouse: 'South Branch',
      toWarehouse: warehouse?.name,
      products: [
        { name: 'HP Laptop', quantity: 2 }
      ],
      totalItems: 2,
      requestDate: '2025-01-16',
      completedDate: null,
      status: 'in_transit',
      requestedBy: 'Pedro Sanchez',
      approvedBy: 'Maria Rodriguez'
    },
    {
      id: 'TR-2025-004',
      type: 'outgoing',
      fromWarehouse: warehouse?.name,
      toWarehouse: 'East Branch',
      products: [
        { name: 'Dell Monitor', quantity: 4 },
        { name: 'Wireless Mouse', quantity: 12 }
      ],
      totalItems: 16,
      requestDate: '2025-01-13',
      completedDate: null,
      status: 'pending_approval',
      requestedBy: 'Sofia Martinez',
      approvedBy: null
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'incoming', label: 'Incoming' },
    { value: 'outgoing', label: 'Outgoing' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
      in_transit: { bg: 'bg-primary/10', text: 'text-primary', label: 'In Transit' },
      pending_approval: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending Approval' },
      cancelled: { bg: 'bg-error/10', text: 'text-error', label: 'Cancelled' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending_approval;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'incoming' ? 'ArrowDown' : 'ArrowUp';
  };

  const getTypeColor = (type) => {
    return type === 'incoming' ? 'text-success' : 'text-warning';
  };

  const filteredTransfers = transferHistory?.filter(transfer => {
    const matchesSearch = transfer?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transfer?.fromWarehouse?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transfer?.toWarehouse?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transfer?.products?.some(p => p?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || transfer?.status === statusFilter;
    const matchesType = typeFilter === 'all' || transfer?.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (!isOpen || !warehouse) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ArrowRightLeft" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Transfer History</h2>
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

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="search"
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
            
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            />
            
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="Filter by type"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="space-y-4">
            {filteredTransfers?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Package" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No transfers found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ?'Try adjusting your filters to see more results.' :'No transfer history available for this warehouse.'
                  }
                </p>
              </div>
            ) : (
              filteredTransfers?.map((transfer) => (
                <div key={transfer?.id} className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transfer?.type === 'incoming' ? 'bg-success/10' : 'bg-warning/10'}`}>
                        <Icon 
                          name={getTypeIcon(transfer?.type)} 
                          size={16} 
                          className={getTypeColor(transfer?.type)}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{transfer?.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {transfer?.type === 'incoming' 
                            ? `From ${transfer?.fromWarehouse}` 
                            : `To ${transfer?.toWarehouse}`
                          }
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(transfer?.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Request Date:</span>
                      <div className="font-medium text-foreground">{transfer?.requestDate}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Completed Date:</span>
                      <div className="font-medium text-foreground">
                        {transfer?.completedDate || 'Pending'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Items:</span>
                      <div className="font-medium text-foreground">{transfer?.totalItems}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground mb-2 block">Products:</span>
                    <div className="flex flex-wrap gap-2">
                      {transfer?.products?.map((product, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {product?.name} (×{product?.quantity})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requested by:</span>
                      <span className="text-foreground font-medium ml-2">{transfer?.requestedBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Approved by:</span>
                      <span className="text-foreground font-medium ml-2">
                        {transfer?.approvedBy || 'Pending approval'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTransfers?.length} of {transferHistory?.length} transfers
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
            >
              Export History
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
    </div>
  );
};

export default TransferHistoryModal;