import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select action...' },
    { value: 'activate', label: 'Activate Selected' },
    { value: 'deactivate', label: 'Deactivate Selected' },
    { value: 'maintenance', label: 'Set to Maintenance' },
    { value: 'export', label: 'Export Selected' },
    { value: 'delete', label: 'Delete Selected' }
  ];

  const handleActionExecute = () => {
    if (selectedAction && selectedCount > 0) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  const getActionIcon = (action) => {
    const iconMap = {
      activate: 'CheckCircle',
      deactivate: 'XCircle',
      maintenance: 'Settings',
      export: 'Download',
      delete: 'Trash2'
    };
    return iconMap?.[action] || 'Play';
  };

  const getActionVariant = (action) => {
    if (action === 'delete') return 'destructive';
    if (action === 'deactivate') return 'outline';
    return 'default';
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedCount} warehouse{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Choose action"
              className="w-48"
            />

            <Button
              variant={getActionVariant(selectedAction)}
              size="sm"
              iconName={getActionIcon(selectedAction)}
              onClick={handleActionExecute}
              disabled={!selectedAction}
            >
              Execute
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClearSelection}
        >
          Clear Selection
        </Button>
      </div>

      {selectedAction && (
        <div className="mt-3 pt-3 border-t border-primary/20">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
            <span className="text-muted-foreground">
              {selectedAction === 'delete' && 
                'Warning: This action will permanently delete the selected warehouses and cannot be undone.'
              }
              {selectedAction === 'deactivate' && 'This will deactivate the selected warehouses. Ensure all inventory is transferred first.'
              }
              {selectedAction === 'activate' && 'This will activate the selected warehouses and make them available for operations.'
              }
              {selectedAction === 'maintenance' && 'This will set the selected warehouses to maintenance mode, temporarily suspending operations.'
              }
              {selectedAction === 'export' && 
                'This will export the selected warehouse data to a CSV file.'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;