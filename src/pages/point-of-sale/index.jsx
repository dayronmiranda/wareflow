import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import ProductSearch from './components/ProductSearch';
import CustomerSelector from './components/CustomerSelector';
import ShoppingCart from './components/ShoppingCart';
import PaymentProcessor from './components/PaymentProcessor';
import SaleCompletionModal from './components/SaleCompletionModal';
import StockWarningAlert from './components/StockWarningAlert';
import PriceChangeNotification from './components/PriceChangeNotification';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PointOfSale = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [stockWarnings, setStockWarnings] = useState([]);
  const [priceChanges, setPriceChanges] = useState([]);
  const [showStockWarnings, setShowStockWarnings] = useState(true);

  // Mock stock warnings
  const mockStockWarnings = [
    {
      productId: 'P005',
      productName: 'Canon EOS R6 Camera',
      sku: 'CER6-BODY',
      currentStock: 2,
      price: 125000
    },
    {
      productId: 'P004',
      productName: 'Dell XPS 13 Laptop',
      sku: 'DXP13-512',
      currentStock: 3,
      price: 85000
    }
  ];

  // Mock price changes (simulated)
  const mockPriceChanges = [
    {
      productId: 'P001',
      productName: 'Samsung Galaxy S24',
      oldPrice: 45000,
      newPrice: 47000,
      changePercent: 4.4
    }
  ];

  useEffect(() => {
    // Simulate stock warnings check
    const checkStockLevels = () => {
      const lowStockItems = mockStockWarnings?.filter(item => item?.currentStock <= 5);
      setStockWarnings(lowStockItems);
    };

    checkStockLevels();

    // Simulate price change notifications (randomly)
    const priceChangeInterval = setInterval(() => {
      if (cartItems?.length > 0 && Math.random() > 0.8) {
        setPriceChanges(mockPriceChanges);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(priceChangeInterval);
  }, [cartItems]);

  const handleProductSelect = (product) => {
    const existingItem = cartItems?.find(item => item?.id === product?.id);
    
    if (existingItem) {
      if (existingItem?.quantity < product?.availableStock) {
        setCartItems(prev => prev?.map(item =>
          item?.id === product?.id
            ? { ...item, quantity: item?.quantity + 1 }
            : item
        ));
      }
    } else {
      setCartItems(prev => [...prev, {
        ...product,
        quantity: 1
      }]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems(prev => prev?.map(item =>
      item?.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev?.filter(item => item?.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
  };

  const handleAddNewCustomer = (customerData) => {
    setCustomers(prev => [...prev, customerData]);
  };

  const calculateTotals = () => {
    const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handlePaymentComplete = async (paymentData) => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { subtotal, tax, total } = calculateTotals();
      const selectedCustomerData = customers?.find(c => c?.value === selectedCustomer);
      
      const saleData = {
        invoiceNumber: paymentData?.invoiceNumber,
        items: cartItems,
        customer: selectedCustomerData,
        subtotal,
        tax,
        totalAmount: total,
        paymentMethod: paymentData?.method,
        ...(paymentData?.method === 'cash' && {
          cashReceived: paymentData?.cashReceived,
          change: paymentData?.change
        }),
        timestamp: paymentData?.timestamp,
        warehouse: 'Main Warehouse'
      };
      
      setCompletedSale(saleData);
      setShowCompletionModal(true);
      
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleNewSale = () => {
    setCartItems([]);
    setSelectedCustomer('');
    setCompletedSale(null);
    setShowCompletionModal(false);
  };

  const handlePrintReceipt = () => {
    console.log('Printing receipt for:', completedSale?.invoiceNumber);
    // Implement receipt printing logic
  };

  const handleAcceptPriceChanges = (changes) => {
    // Update cart items with new prices
    setCartItems(prev => prev?.map(item => {
      const priceChange = changes?.find(change => change?.productId === item?.id);
      return priceChange ? { ...item, price: priceChange?.newPrice } : item;
    }));
    setPriceChanges([]);
  };

  const handleRejectPriceChanges = () => {
    setPriceChanges([]);
  };

  const { total } = calculateTotals();
  const canProcessPayment = cartItems?.length > 0 && !isProcessingPayment;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionToolbar userRole="manager" />
      <div className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
              <p className="text-muted-foreground">
                Process sales transactions and manage customer orders
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
                <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" />
                <span className="text-sm text-muted-foreground">Main Warehouse</span>
              </div>
              
              <Button
                variant="outline"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={handleNewSale}
                disabled={cartItems?.length === 0}
              >
                Clear Sale
              </Button>
            </div>
          </div>

          {/* Stock Warnings */}
          {showStockWarnings && stockWarnings?.length > 0 && (
            <StockWarningAlert
              warnings={stockWarnings}
              onDismiss={() => setShowStockWarnings(false)}
              onViewInventory={() => window.location.href = '/inventory-management'}
            />
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Search & Customer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Search */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Search" size={20} />
                  <h2 className="text-lg font-semibold text-foreground">Product Search</h2>
                </div>
                
                <ProductSearch
                  onProductSelect={handleProductSelect}
                  currentWarehouse="Main Warehouse"
                />
              </div>

              {/* Customer Selection */}
              <div className="bg-card border border-border rounded-lg p-4">
                <CustomerSelector
                  selectedCustomer={selectedCustomer}
                  onCustomerSelect={handleCustomerSelect}
                  onAddNewCustomer={handleAddNewCustomer}
                />
              </div>

              {/* Mobile Cart (visible on small screens) */}
              <div className="lg:hidden">
                <ShoppingCart
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                />
              </div>
            </div>

            {/* Right Column - Cart & Payment */}
            <div className="space-y-6">
              {/* Desktop Cart */}
              <div className="hidden lg:block">
                <ShoppingCart
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                />
              </div>

              {/* Payment Processor */}
              <PaymentProcessor
                totalAmount={total}
                onPaymentComplete={handlePaymentComplete}
                isProcessing={isProcessingPayment}
                disabled={!canProcessPayment}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Price Change Notification */}
      <PriceChangeNotification
        priceChanges={priceChanges}
        onAcceptChanges={handleAcceptPriceChanges}
        onRejectChanges={handleRejectPriceChanges}
        onDismiss={() => setPriceChanges([])}
      />
      {/* Sale Completion Modal */}
      <SaleCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        saleData={completedSale}
        onPrintReceipt={handlePrintReceipt}
        onNewSale={handleNewSale}
      />
    </div>
  );
};

export default PointOfSale;