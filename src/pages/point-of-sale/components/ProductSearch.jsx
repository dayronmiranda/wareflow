import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const ProductSearch = ({ onProductSelect, currentWarehouse = 'Main Warehouse' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Mock product data with warehouse-specific stock
  const mockProducts = [
    {
      id: 'P001',
      name: 'Samsung Galaxy S24',
      sku: 'SGS24-128',
      category: 'Electronics',
      price: 45000,
      stock: {
        'Main Warehouse': 15,
        'North Branch': 8,
        'South Branch': 12
      },
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'P002',
      name: 'Apple iPhone 15',
      sku: 'IP15-256',
      category: 'Electronics',
      price: 65000,
      stock: {
        'Main Warehouse': 8,
        'North Branch': 5,
        'South Branch': 3
      },
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'P003',
      name: 'Sony WH-1000XM5 Headphones',
      sku: 'SWH-1000XM5',
      category: 'Audio',
      price: 18500,
      stock: {
        'Main Warehouse': 25,
        'North Branch': 12,
        'South Branch': 18
      },
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'P004',
      name: 'Dell XPS 13 Laptop',
      sku: 'DXP13-512',
      category: 'Computers',
      price: 85000,
      stock: {
        'Main Warehouse': 6,
        'North Branch': 4,
        'South Branch': 2
      },
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'P005',
      name: 'Canon EOS R6 Camera',
      sku: 'CER6-BODY',
      category: 'Photography',
      price: 125000,
      stock: {
        'Main Warehouse': 3,
        'North Branch': 1,
        'South Branch': 2
      },
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'P006',
      name: 'Nike Air Max 270',
      sku: 'NAM270-42',
      category: 'Footwear',
      price: 8500,
      stock: {
        'Main Warehouse': 45,
        'North Branch': 32,
        'South Branch': 28
      },
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm?.trim()?.length > 0) {
      setIsSearching(true);
      
      // Simulate API delay
      const searchTimeout = setTimeout(() => {
        const filtered = mockProducts?.filter(product =>
          product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
        
        setSearchResults(filtered);
        setShowResults(true);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const handleProductSelect = (product) => {
    const currentStock = product?.stock?.[currentWarehouse] || 0;
    
    if (currentStock > 0) {
      onProductSelect({
        ...product,
        availableStock: currentStock
      });
      setSearchTerm('');
      setShowResults(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <div className="animate-spin">
              <Icon name="Loader2" size={18} color="var(--color-muted-foreground)" />
            </div>
          ) : (
            <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
          )}
        </div>
      </div>
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-elevated z-50 max-h-96 overflow-y-auto">
          {searchResults?.length > 0 ? (
            <div className="p-2">
              {searchResults?.map((product) => {
                const currentStock = product?.stock?.[currentWarehouse] || 0;
                const isOutOfStock = currentStock === 0;
                
                return (
                  <button
                    key={product?.id}
                    onClick={() => handleProductSelect(product)}
                    disabled={isOutOfStock}
                    className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors duration-150 ease-out ${
                      isOutOfStock
                        ? 'opacity-50 cursor-not-allowed bg-muted/50' :'hover:bg-muted cursor-pointer'
                    }`}
                  >
                    <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground truncate">
                            {product?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product?.sku} • {product?.category}
                          </p>
                        </div>
                        
                        <div className="text-right ml-3">
                          <div className="font-semibold text-foreground">
                            {formatPrice(product?.price)}
                          </div>
                          <div className={`text-sm ${
                            isOutOfStock 
                              ? 'text-error' 
                              : currentStock <= 5 
                                ? 'text-warning' :'text-success'
                          }`}>
                            {isOutOfStock ? 'Out of Stock' : `${currentStock} in stock`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Icon name="Search" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;