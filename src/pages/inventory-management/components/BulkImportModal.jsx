import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkImportModal = ({ 
  isOpen, 
  onClose, 
  onImport 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const csvTemplate = `Product Name,SKU,Current Stock,Unit,Cost Price,Selling Price,Min Threshold,Max Threshold,Category,Location,Warehouse
Rice 5kg,RICE-5KG,100,kg,45.50,55.00,20,200,Grains,A1-B2-C1,Main Warehouse
Cooking Oil 1L,OIL-1L,50,liter,85.00,95.00,10,100,Oils,A2-B1-C3,Main Warehouse
Black Beans 1kg,BEANS-1KG,75,kg,25.00,30.00,15,150,Legumes,A1-B3-C2,Main Warehouse`;

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileSelect(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file?.type === 'text/csv') {
      setSelectedFile(file);
      setImportResults(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileSelect(e?.target?.files?.[0]);
    }
  };

  const processImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      const mockResults = {
        totalRows: 125,
        successful: 118,
        failed: 7,
        errors: [
          { row: 15, error: 'Invalid SKU format: must be alphanumeric' },
          { row: 23, error: 'Cost price cannot be negative' },
          { row: 45, error: 'Missing required field: Product Name' },
          { row: 67, error: 'Invalid warehouse: Warehouse not found' },
          { row: 89, error: 'Duplicate SKU: RICE-5KG already exists' },
          { row: 102, error: 'Invalid unit: must be kg, liter, piece, or box' },
          { row: 115, error: 'Min threshold cannot be greater than max threshold' }
        ]
      };
      
      setImportResults(mockResults);
      setIsProcessing(false);
      
      if (mockResults?.successful > 0) {
        onImport(mockResults);
      }
    }, 3000);
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_import_template.csv';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setImportResults(null);
    setIsProcessing(false);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bulk Import Inventory</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Import multiple products and stock levels from CSV file
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!importResults && (
            <>
              {/* Instructions */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} color="var(--color-accent)" />
                  <div className="text-sm">
                    <h3 className="font-medium text-accent mb-2">Import Instructions</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Use the provided CSV template for proper formatting</li>
                      <li>• All required fields must be filled: Product Name, SKU, Current Stock</li>
                      <li>• SKU must be unique across all products</li>
                      <li>• Stock quantities must be non-negative numbers</li>
                      <li>• Prices should be in CUP (Cuban Peso)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Template Download */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-foreground">CSV Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Download the template with sample data and proper formatting
                  </p>
                </div>
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={downloadTemplate}
                >
                  Download Template
                </Button>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <Icon name="FileText" size={24} color="var(--color-success)" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{selectedFile?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile?.size / 1024)?.toFixed(2)} KB
                      </p>
                    </div>
                    <div className="flex space-x-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="X"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Upload"
                        onClick={processImport}
                        loading={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Import File'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Icon name="Upload" size={24} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Drop your CSV file here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse and select a file
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef?.current?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Import Results */}
          {importResults && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={24} color="var(--color-success)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Import Completed</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your inventory data has been processed
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{importResults?.totalRows}</div>
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                </div>
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success">{importResults?.successful}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="bg-error/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-error">{importResults?.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {/* Errors */}
              {importResults?.errors?.length > 0 && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                  <h4 className="font-medium text-error mb-3 flex items-center">
                    <Icon name="AlertCircle" size={16} className="mr-2" />
                    Import Errors ({importResults?.errors?.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {importResults?.errors?.map((error, index) => (
                      <div key={index} className="text-sm bg-card rounded p-2">
                        <span className="font-medium">Row {error?.row}:</span>
                        <span className="ml-2 text-muted-foreground">{error?.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          {importResults ? (
            <>
              <Button
                variant="outline"
                onClick={resetModal}
              >
                Import Another File
              </Button>
              <Button
                variant="default"
                onClick={handleClose}
              >
                Done
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={handleClose}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;