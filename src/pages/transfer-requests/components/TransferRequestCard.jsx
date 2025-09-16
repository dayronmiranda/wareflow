import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransferRequestCard = ({ request, onApprove, onReject, onComplete, userRole = 'manager', currentWarehouse = 'Main Warehouse' }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

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

  const canApprove = userRole === 'owner' || (userRole === 'manager' && request?.destinationWarehouse === currentWarehouse);
  const canComplete = request?.status === 'approved' && request?.destinationWarehouse === currentWarehouse;

  const handleApprove = () => {
    if (comment?.trim()) {
      onApprove(request?.id, comment);
      setComment('');
      setShowCommentInput(false);
    } else {
      onApprove(request?.id);
    }
  };

  const handleReject = () => {
    if (comment?.trim()) {
      onReject(request?.id, comment);
      setComment('');
      setShowCommentInput(false);
    } else {
      setShowCommentInput(true);
    }
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

  const totalItems = request?.products?.reduce((sum, product) => sum + product?.quantity, 0) || 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-foreground">{request?.id}</h3>
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request?.status)}`}>
              <Icon name={getStatusIcon(request?.status)} size={12} />
              <span className="capitalize">{request?.status}</span>
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="ArrowRight" size={14} />
              <span>{request?.sourceWarehouse} → {request?.destinationWarehouse}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={14} />
              <span>{totalItems} items • {request?.products?.length || 0} products</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(request?.createdAt)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={16} />
        </button>
      </div>
      {/* Actions */}
      {request?.status === 'pending' && canApprove && (
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            size="sm"
            variant="success"
            iconName="Check"
            iconPosition="left"
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            iconName="X"
            iconPosition="left"
            onClick={handleReject}
          >
            Reject
          </Button>
        </div>
      )}
      {canComplete && (
        <div className="mb-3">
          <Button
            size="sm"
            variant="default"
            iconName="Package"
            iconPosition="left"
            onClick={() => onComplete(request?.id)}
          >
            Mark as Received
          </Button>
        </div>
      )}
      {/* Comment Input */}
      {showCommentInput && (
        <div className="mb-3 p-3 bg-muted rounded-md">
          <textarea
            value={comment}
            onChange={(e) => setComment(e?.target?.value)}
            placeholder="Add a comment (required for rejection)..."
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCommentInput(false);
                setComment('');
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={!comment?.trim()}
            >
              Reject with Comment
            </Button>
          </div>
        </div>
      )}
      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-border pt-3 space-y-3">
          {/* Justification */}
          {request?.justification && (
            <div>
              <h4 className="font-medium text-sm text-foreground mb-1">Justification</h4>
              <p className="text-sm text-muted-foreground">{request?.justification}</p>
            </div>
          )}

          {/* Products */}
          <div>
            <h4 className="font-medium text-sm text-foreground mb-2">Products</h4>
            <div className="space-y-2">
              {request?.products?.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product?.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product?.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">Qty: {product?.quantity}</p>
                    <p className="text-xs text-muted-foreground">
                      ${product?.price?.toFixed(2) || '0.00'} CUP
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No products listed</p>
              )}
            </div>
          </div>

          {/* History */}
          {request?.history && request?.history?.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">History</h4>
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

          {/* Created By */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Created by: {request?.createdBy}</span>
            {request?.approvedBy && (
              <span>Approved by: {request?.approvedBy}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferRequestCard;