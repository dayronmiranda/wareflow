import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CustomerSelector = ({ selectedCustomer, onCustomerSelect, onAddNewCustomer }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    idCard: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  // Mock customer data
  const mockCustomers = [
    {
      value: 'C001',
      label: 'María González Pérez',
      description: 'ID: 85041512345 • Phone: +53 5234-5678',
      email: 'maria.gonzalez@email.cu',
      phone: '+53 5234-5678',
      idCard: '85041512345',
      address: 'Calle 23 #456, Vedado, La Habana'
    },
    {
      value: 'C002',
      label: 'Carlos Rodríguez López',
      description: 'ID: 90032198765 • Phone: +53 5345-6789',
      email: 'carlos.rodriguez@email.cu',
      phone: '+53 5345-6789',
      idCard: '90032198765',
      address: 'Ave. 26 #123, Nuevo Vedado, La Habana'
    },
    {
      value: 'C003',
      label: 'Ana Martínez Fernández',
      description: 'ID: 88071887654 • Phone: +53 5456-7890',
      email: 'ana.martinez@email.cu',
      phone: '+53 5456-7890',
      idCard: '88071887654',
      address: 'Calle L #789, El Vedado, La Habana'
    },
    {
      value: 'C004',
      label: 'José Luis Herrera',
      description: 'ID: 92051234567 • Phone: +53 5567-8901',
      email: 'jose.herrera@email.cu',
      phone: '+53 5567-8901',
      idCard: '92051234567',
      address: 'Ave. Paseo #321, Plaza, La Habana'
    }
  ];

  const validateCubanID = (id) => {
    // Cuban ID format: 11 digits (YYMMDDXXXXX)
    const idRegex = /^\d{11}$/;
    if (!idRegex?.test(id)) return false;
    
    // Basic date validation (first 6 digits should form a valid date)
    const year = parseInt(id?.substring(0, 2));
    const month = parseInt(id?.substring(2, 4));
    const day = parseInt(id?.substring(4, 6));
    
    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
  };

  const validatePhone = (phone) => {
    // Cuban phone format: +53 followed by 8 digits
    const phoneRegex = /^\+53\s?\d{4}-?\d{4}$/;
    return phoneRegex?.test(phone);
  };

  const handleInputChange = (field, value) => {
    setNewCustomer(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newCustomer?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newCustomer?.idCard?.trim()) {
      newErrors.idCard = 'ID card is required';
    } else if (!validateCubanID(newCustomer?.idCard)) {
      newErrors.idCard = 'Invalid Cuban ID format (11 digits required)';
    }
    
    if (newCustomer?.phone && !validatePhone(newCustomer?.phone)) {
      newErrors.phone = 'Invalid phone format (+53 XXXX-XXXX)';
    }
    
    if (newCustomer?.email && !/\S+@\S+\.\S+/?.test(newCustomer?.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleAddCustomer = () => {
    if (validateForm()) {
      const customerId = `C${String(mockCustomers?.length + 1)?.padStart(3, '0')}`;
      const customerData = {
        value: customerId,
        label: newCustomer?.name,
        description: `ID: ${newCustomer?.idCard} • Phone: ${newCustomer?.phone}`,
        ...newCustomer
      };
      
      onAddNewCustomer(customerData);
      onCustomerSelect(customerId);
      
      // Reset form
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        idCard: '',
        address: ''
      });
      setShowAddForm(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      idCard: '',
      address: ''
    });
    setErrors({});
  };

  if (showAddForm) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Add New Customer</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleCancel}
          />
        </div>
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter customer's full name"
            value={newCustomer?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />
          
          <Input
            label="Cuban ID Card"
            type="text"
            placeholder="Enter 11-digit ID number"
            value={newCustomer?.idCard}
            onChange={(e) => handleInputChange('idCard', e?.target?.value)}
            error={errors?.idCard}
            description="Format: 11 digits (YYMMDDXXXXX)"
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+53 5234-5678"
            value={newCustomer?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            description="Format: +53 XXXX-XXXX"
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="customer@email.cu"
            value={newCustomer?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
          />
          
          <Input
            label="Address"
            type="text"
            placeholder="Enter customer's address"
            value={newCustomer?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
          />
          
          <div className="flex space-x-3 pt-2">
            <Button
              variant="default"
              onClick={handleAddCustomer}
              iconName="Plus"
              iconPosition="left"
            >
              Add Customer
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Customer</label>
        <Button
          variant="outline"
          size="sm"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => setShowAddForm(true)}
        >
          Add New
        </Button>
      </div>
      <Select
        placeholder="Select a customer or continue as guest"
        searchable
        clearable
        options={mockCustomers}
        value={selectedCustomer}
        onChange={onCustomerSelect}
        className="w-full"
      />
      {selectedCustomer && (
        <div className="bg-muted rounded-md p-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="flex-1">
              {(() => {
                const customer = mockCustomers?.find(c => c?.value === selectedCustomer);
                if (!customer) return null;
                
                return (
                  <div>
                    <h4 className="font-medium text-foreground">{customer?.label}</h4>
                    <p className="text-sm text-muted-foreground">ID: {customer?.idCard}</p>
                    {customer?.phone && (
                      <p className="text-sm text-muted-foreground">Phone: {customer?.phone}</p>
                    )}
                    {customer?.email && (
                      <p className="text-sm text-muted-foreground">Email: {customer?.email}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;