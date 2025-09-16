import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import TransferRequestModal from './components/TransferRequestModal';
import TransferRequestCard from './components/TransferRequestCard';
import TransferRequestTable from './components/TransferRequestTable';
import TransferRequestFilters from './components/TransferRequestFilters';
import TransferRequestStats from './components/TransferRequestStats';

const TransferRequests = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('outgoing');
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole] = useState('manager'); // This would come from auth context
  const [currentWarehouse] = useState('Main Warehouse');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({
    warehouse: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Mock data for transfer requests
  const mockRequests = [
    {
      id: 'TR-2025001',
      sourceWarehouse: 'Main Warehouse',
      destinationWarehouse: 'North Branch',
      products: [
        { id: 1, name: 'Laptop Dell Inspiron 15', sku: 'LAP-001', quantity: 5, price: 850.00 },
        { id: 2, name: 'Wireless Mouse Logitech', sku: 'MOU-002', quantity: 10, price: 35.50 }
      ],
      status: 'pending',
      justification: 'Restocking for increased demand in North Branch location',
      createdAt: new Date('2025-01-15T10:30:00'),
      createdBy: 'John Manager',
      history: [
        {
          action: 'Request Created',
          status: 'pending',
          user: 'John Manager',
          timestamp: new Date('2025-01-15T10:30:00'),
          comment: 'Initial request submission'
        }
      ]
    },
    {
      id: 'TR-2025002',
      sourceWarehouse: 'South Branch',
      destinationWarehouse: 'Main Warehouse',
      products: [
        { id: 3, name: 'USB-C Cable 2m', sku: 'CAB-003', quantity: 25, price: 15.75 },
        { id: 4, name: 'Monitor Samsung 24"', sku: 'MON-004', quantity: 3, price: 320.00 }
      ],
      status: 'approved',
      justification: 'Return of excess inventory to main warehouse',
      createdAt: new Date('2025-01-14T14:20:00'),
      createdBy: 'Maria Rodriguez',
      approvedBy: 'Admin User',
      history: [
        {
          action: 'Request Created',
          status: 'pending',
          user: 'Maria Rodriguez',
          timestamp: new Date('2025-01-14T14:20:00'),
          comment: 'Initial request submission'
        },
        {
          action: 'Request Approved',
          status: 'approved',
          user: 'Admin User',
          timestamp: new Date('2025-01-14T16:45:00'),
          comment: 'Approved for transfer'
        }
      ]
    },
    {
      id: 'TR-2025003',
      sourceWarehouse: 'Main Warehouse',
      destinationWarehouse: 'East Warehouse',
      products: [
        { id: 5, name: 'Keyboard Mechanical RGB', sku: 'KEY-005', quantity: 8, price: 125.00 }
      ],
      status: 'completed',
      justification: 'New warehouse setup requirements',
      createdAt: new Date('2025-01-13T09:15:00'),
      createdBy: 'Current User',
      approvedBy: 'Admin User',
      completedAt: new Date('2025-01-13T15:30:00'),
      history: [
        {
          action: 'Request Created',
          status: 'pending',
          user: 'Current User',
          timestamp: new Date('2025-01-13T09:15:00'),
          comment: 'Initial request submission'
        },
        {
          action: 'Request Approved',
          status: 'approved',
          user: 'Admin User',
          timestamp: new Date('2025-01-13T11:20:00'),
          comment: 'Approved for immediate transfer'
        },
        {
          action: 'Transfer Completed',
          status: 'completed',
          user: 'East Manager',
          timestamp: new Date('2025-01-13T15:30:00'),
          comment: 'Items received and verified'
        }
      ]
    },
    {
      id: 'TR-2025004',
      sourceWarehouse: 'North Branch',
      destinationWarehouse: 'Main Warehouse',
      products: [
        { id: 2, name: 'Wireless Mouse Logitech', sku: 'MOU-002', quantity: 5, price: 35.50 }
      ],
      status: 'rejected',
      justification: 'Defective items need to be returned',
      createdAt: new Date('2025-01-12T11:45:00'),
      createdBy: 'North Manager',
      history: [
        {
          action: 'Request Created',
          status: 'pending',
          user: 'North Manager',
          timestamp: new Date('2025-01-12T11:45:00'),
          comment: 'Initial request submission'
        },
        {
          action: 'Request Rejected',
          status: 'rejected',
          user: 'Admin User',
          timestamp: new Date('2025-01-12T13:20:00'),
          comment: 'Please follow defective item return process instead'
        }
      ]
    },
    {
      id: 'TR-2025005',
      sourceWarehouse: 'Main Warehouse',
      destinationWarehouse: 'West Depot',
      products: [
        { id: 1, name: 'Laptop Dell Inspiron 15', sku: 'LAP-001', quantity: 3, price: 850.00 },
        { id: 4, name: 'Monitor Samsung 24"', sku: 'MON-004', quantity: 2, price: 320.00 }
      ],
      status: 'in-transit',
      justification: 'Fulfilling customer orders at West Depot',
      createdAt: new Date('2025-01-16T08:00:00'),
      createdBy: 'Current User',
      approvedBy: 'Admin User',
      history: [
        {
          action: 'Request Created',
          status: 'pending',
          user: 'Current User',
          timestamp: new Date('2025-01-16T08:00:00'),
          comment: 'Initial request submission'
        },
        {
          action: 'Request Approved',
          status: 'approved',
          user: 'Admin User',
          timestamp: new Date('2025-01-16T09:30:00'),
          comment: 'Approved for transfer'
        },
        {
          action: 'Items Dispatched',
          status: 'in-transit',
          user: 'Warehouse Staff',
          timestamp: new Date('2025-01-16T11:00:00'),
          comment: 'Items packed and sent for delivery'
        }
      ]
    }
  ];

  useEffect(() => {
    setRequests(mockRequests);
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    // Filter by tab
    if (activeTab === 'outgoing') {
      filtered = filtered?.filter(r => r?.sourceWarehouse === currentWarehouse);
    } else if (activeTab === 'incoming') {
      filtered = filtered?.filter(r => r?.destinationWarehouse === currentWarehouse);
    }

    // Apply filters
    if (filters?.warehouse && filters?.warehouse !== 'all') {
      filtered = filtered?.filter(r => 
        r?.sourceWarehouse?.toLowerCase()?.includes(filters?.warehouse) ||
        r?.destinationWarehouse?.toLowerCase()?.includes(filters?.warehouse)
      );
    }

    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter(r => r?.status === filters?.status);
    }

    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered?.filter(r => new Date(r.createdAt) >= fromDate);
    }

    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(r => new Date(r.createdAt) <= toDate);
    }

    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(r =>
        r?.id?.toLowerCase()?.includes(searchTerm) ||
        r?.justification?.toLowerCase()?.includes(searchTerm) ||
        r?.products?.some(p => p?.name?.toLowerCase()?.includes(searchTerm))
      );
    }

    setFilteredRequests(filtered);
  }, [requests, activeTab, filters, currentWarehouse]);

  const handleCreateRequest = (requestData) => {
    setRequests(prev => [requestData, ...prev]);
  };

  const handleApproveRequest = (requestId, comment = '') => {
    setRequests(prev => prev?.map(request => {
      if (request?.id === requestId) {
        const updatedHistory = [
          ...request?.history,
          {
            action: 'Request Approved',
            status: 'approved',
            user: 'Current User',
            timestamp: new Date(),
            comment: comment || 'Request approved'
          }
        ];
        return {
          ...request,
          status: 'approved',
          approvedBy: 'Current User',
          history: updatedHistory
        };
      }
      return request;
    }));
  };

  const handleRejectRequest = (requestId, comment = 'Request rejected') => {
    setRequests(prev => prev?.map(request => {
      if (request?.id === requestId) {
        const updatedHistory = [
          ...request?.history,
          {
            action: 'Request Rejected',
            status: 'rejected',
            user: 'Current User',
            timestamp: new Date(),
            comment
          }
        ];
        return {
          ...request,
          status: 'rejected',
          history: updatedHistory
        };
      }
      return request;
    }));
  };

  const handleCompleteRequest = (requestId) => {
    setRequests(prev => prev?.map(request => {
      if (request?.id === requestId) {
        const updatedHistory = [
          ...request?.history,
          {
            action: 'Transfer Completed',
            status: 'completed',
            user: 'Current User',
            timestamp: new Date(),
            comment: 'Items received and verified'
          }
        ];
        return {
          ...request,
          status: 'completed',
          completedAt: new Date(),
          history: updatedHistory
        };
      }
      return request;
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      warehouse: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const tabs = [
    { id: 'outgoing', label: 'Outgoing Requests', icon: 'ArrowUp' },
    { id: 'incoming', label: 'Incoming Requests', icon: 'ArrowDown' },
    { id: 'history', label: 'Request History', icon: 'History' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionToolbar userRole={userRole} />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transfer Requests</h1>
              <p className="mt-2 text-muted-foreground">
                Manage inventory transfers between warehouses
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Table" size={16} />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Grid3X3" size={16} />
                  <span>Cards</span>
                </button>
              </div>

              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsModalOpen(true)}
              >
                Create Request
              </Button>
            </div>
          </div>

          {/* Stats */}
          <TransferRequestStats 
            requests={requests} 
            userRole={userRole} 
            currentWarehouse={currentWarehouse} 
          />

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      {activeTab === 'outgoing' 
                        ? requests?.filter(r => r?.sourceWarehouse === currentWarehouse)?.length
                        : activeTab === 'incoming'
                        ? requests?.filter(r => r?.destinationWarehouse === currentWarehouse)?.length
                        : requests?.length
                      }
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Filters */}
          <TransferRequestFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            userRole={userRole}
            currentWarehouse={currentWarehouse}
          />

          {/* Content */}
          <div className="space-y-6">
            {filteredRequests?.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Transfer Requests</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'outgoing' ?'No outgoing transfer requests found.'
                    : activeTab === 'incoming' ?'No incoming transfer requests found.' :'No transfer requests match your current filters.'
                  }
                </p>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create First Request
                </Button>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <TransferRequestTable
                    requests={filteredRequests}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    onComplete={handleCompleteRequest}
                    userRole={userRole}
                    currentWarehouse={currentWarehouse}
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRequests?.map((request) => (
                      <TransferRequestCard
                        key={request?.id}
                        request={request}
                        onApprove={handleApproveRequest}
                        onReject={handleRejectRequest}
                        onComplete={handleCompleteRequest}
                        userRole={userRole}
                        currentWarehouse={currentWarehouse}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      {/* Create Request Modal */}
      <TransferRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRequest}
        currentWarehouse={currentWarehouse}
      />
    </div>
  );
};

export default TransferRequests;