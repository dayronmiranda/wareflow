import React from 'react';
import Icon from '../../../components/AppIcon';

const TransferRequestStats = ({ requests = [], userRole = 'manager', currentWarehouse = 'Main Warehouse' }) => {
  const calculateStats = () => {
    const stats = {
      total: requests?.length,
      pending: requests?.filter(r => r?.status === 'pending')?.length,
      approved: requests?.filter(r => r?.status === 'approved')?.length,
      completed: requests?.filter(r => r?.status === 'completed')?.length,
      rejected: requests?.filter(r => r?.status === 'rejected')?.length,
      inTransit: requests?.filter(r => r?.status === 'in-transit')?.length
    };

    // Calculate warehouse-specific stats
    if (userRole === 'manager') {
      stats.incoming = requests?.filter(r => r?.destinationWarehouse === currentWarehouse)?.length;
      stats.outgoing = requests?.filter(r => r?.sourceWarehouse === currentWarehouse)?.length;
    }

    // Calculate today's requests
    const today = new Date()?.toDateString();
    stats.today = requests?.filter(r => new Date(r.createdAt)?.toDateString() === today)?.length;

    // Calculate total items being transferred
    stats.totalItems = requests?.reduce((sum, request) => {
      return sum + (request?.products?.reduce((productSum, product) => productSum + product?.quantity, 0) || 0);
    }, 0);

    return stats;
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Requests',
      value: stats?.total,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pending Approval',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Approved',
      value: stats?.approved,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Completed',
      value: stats?.completed,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  // Add role-specific stats
  if (userRole === 'manager') {
    statCards?.push(
      {
        title: 'Incoming',
        value: stats?.incoming,
        icon: 'ArrowDown',
        color: 'text-accent',
        bgColor: 'bg-accent/10'
      },
      {
        title: 'Outgoing',
        value: stats?.outgoing,
        icon: 'ArrowUp',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10'
      }
    );
  }

  if (userRole === 'owner') {
    statCards?.push(
      {
        title: 'In Transit',
        value: stats?.inTransit,
        icon: 'Truck',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10'
      },
      {
        title: 'Rejected',
        value: stats?.rejected,
        icon: 'XCircle',
        color: 'text-error',
        bgColor: 'bg-error/10'
      }
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{stat?.title}</div>
        </div>
      ))}
      {/* Additional Summary Cards */}
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/10">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{stats?.today}</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Today's Requests</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
            <Icon name="Box" size={20} className="text-primary" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{stats?.totalItems}</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Total Items</div>
      </div>
    </div>
  );
};

export default TransferRequestStats;