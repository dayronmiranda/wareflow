import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'activate', label: 'Activate Products' },
    { value: 'deactivate', label: 'Deactivate Products' },
    { value: 'export', label: 'Export Selected' },
    { value: 'duplicate', label: 'Duplicate Products' },
    { value: 'delete', label: 'Delete Products' }
  ];

  const handleApplyAction = () => {
    if (selectedAction && selectedCount > 0) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-muted-foreground">
              Choose an action to apply to selected products
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            options={bulkActionOptions}
            value={selectedAction}
            onChange={setSelectedAction}
            placeholder="Select action"
            className="w-48"
          />
          
          <Button
            variant="default"
            size="sm"
            onClick={handleApplyAction}
            disabled={!selectedAction}
            iconName="Play"
            iconPosition="left"
          >
            Apply
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Action Descriptions */}
      {selectedAction && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
            <div className="text-sm">
              {selectedAction === 'activate' && (
                <p className="text-foreground">
                  <strong>Activate Products:</strong> Selected products will be made available for sales and inventory operations.
                </p>
              )}
              {selectedAction === 'deactivate' && (
                <p className="text-foreground">
                  <strong>Deactivate Products:</strong> Selected products will be hidden from sales but remain in inventory.
                </p>
              )}
              {selectedAction === 'export' && (
                <p className="text-foreground">
                  <strong>Export Selected:</strong> Download product data as CSV file including pricing and inventory levels.
                </p>
              )}
              {selectedAction === 'duplicate' && (
                <p className="text-foreground">
                  <strong>Duplicate Products:</strong> Create copies of selected products with new SKUs for easy variant creation.
                </p>
              )}
              {selectedAction === 'delete' && (
                <p className="text-error">
                  <strong>Delete Products:</strong> Permanently remove selected products. This action cannot be undone.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;