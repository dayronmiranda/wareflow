import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransferRequestTable = ({ requests = [], onApprove, onReject, onComplete, userRole = 'manager', currentWarehouse = 'Main Warehouse' }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-error text-error-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'in-transit': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'completed': return 'Package';
      case 'in-transit': return 'Truck';
      default: return 'Circle';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRequests = [...requests]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleRowExpansion = (requestId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(requestId)) {
      newExpanded?.delete(requestId);
    } else {
      newExpanded?.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canApprove = (request) => {
    return userRole === 'owner' || (userRole === 'manager' && request?.destinationWarehouse === currentWarehouse);
  };

  const canComplete = (request) => {
    return request?.status === 'approved' && request?.destinationWarehouse === currentWarehouse;
  };

  if (requests?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Transfer Requests</h3>
        <p className="text-muted-foreground">No transfer requests found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Request ID</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('sourceWarehouse')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Route</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Products</th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Created</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedRequests?.map((request) => (
              <React.Fragment key={request?.id}>
                <tr className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRowExpansion(request?.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Icon 
                          name={expandedRows?.has(request?.id) ? "ChevronDown" : "ChevronRight"} 
                          size={16} 
                        />
                      </button>
                      <span className="font-medium text-foreground">{request?.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-foreground">{request?.sourceWarehouse}</span>
                      <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                      <span className="text-foreground">{request?.destinationWarehouse}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className="font-medium text-foreground">
                        {request?.products?.reduce((sum, p) => sum + p?.quantity, 0) || 0} items
                      </span>
                      <br />
                      <span className="text-muted-foreground">
                        {request?.products?.length || 0} products
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request?.status)}`}>
                      <Icon name={getStatusIcon(request?.status)} size={12} />
                      <span className="capitalize">{request?.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className="text-foreground">{formatDate(request?.createdAt)}</span>
                      <br />
                      <span className="text-muted-foreground">by {request?.createdBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {request?.status === 'pending' && canApprove(request) && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            iconName="Check"
                            onClick={() => onApprove(request?.id)}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            iconName="X"
                            onClick={() => onReject(request?.id)}
                          />
                        </>
                      )}
                      {canComplete(request) && (
                        <Button
                          size="sm"
                          variant="default"
                          iconName="Package"
                          onClick={() => onComplete(request?.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows?.has(request?.id) && (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 bg-muted/30">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Justification */}
                        {request?.justification && (
                          <div>
                            <h4 className="font-medium text-sm text-foreground mb-2">Justification</h4>
                            <p className="text-sm text-muted-foreground">{request?.justification}</p>
                          </div>
                        )}

                        {/* Products Detail */}
                        <div>
                          <h4 className="font-medium text-sm text-foreground mb-2">Product Details</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {request?.products?.map((product, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-card rounded-md text-sm">
                                <div>
                                  <span className="font-medium">{product?.name}</span>
                                  <span className="text-muted-foreground ml-2">({product?.sku})</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-medium">Qty: {product?.quantity}</span>
                                  {product?.price && (
                                    <div className="text-xs text-muted-foreground">
                                      ${product?.price?.toFixed(2)} CUP
                                    </div>
                                  )}
                                </div>
                              </div>
                            )) || (
                              <p className="text-sm text-muted-foreground">No products listed</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* History */}
                      {request?.history && request?.history?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-foreground mb-2">Request History</h4>
                          <div className="space-y-2">
                            {request?.history?.map((entry, index) => (
                              <div key={index} className="flex items-start space-x-3 text-sm">
                                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(entry?.status)?.split(' ')?.[0]}`}></div>
                                <div className="flex-1">
                                  <p className="text-foreground">
                                    <span className="font-medium">{entry?.action}</span>
                                    {entry?.comment && <span className="text-muted-foreground"> - {entry?.comment}</span>}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {entry?.user} • {formatDate(entry?.timestamp)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferRequestTable;