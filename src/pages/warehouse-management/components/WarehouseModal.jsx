import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WarehouseModal = ({ isOpen, onClose, warehouse, onSave, managers }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    managerId: '',
    status: 'active',
    capacity: '',
    operatingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '14:00', closed: false },
      sunday: { open: '08:00', close: '14:00', closed: true }
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse?.name || '',
        location: warehouse?.location || '',
        address: warehouse?.address || '',
        phone: warehouse?.phone || '',
        email: warehouse?.email || '',
        managerId: warehouse?.managerId || '',
        status: warehouse?.status || 'active',
        capacity: warehouse?.capacity || '',
        operatingHours: warehouse?.operatingHours || formData?.operatingHours
      });
    } else {
      setFormData({
        name: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        managerId: '',
        status: 'active',
        capacity: '',
        operatingHours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '08:00', close: '14:00', closed: false },
          sunday: { open: '08:00', close: '14:00', closed: true }
        }
      });
    }
    setErrors({});
  }, [warehouse, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev?.operatingHours,
        [day]: {
          ...prev?.operatingHours?.[day],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Warehouse name is required';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData?.phone && !/^\+53\s\d{8}$/?.test(formData?.phone)) {
      newErrors.phone = 'Phone must be in format: +53 12345678';
    }

    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.capacity || formData?.capacity <= 0) {
      newErrors.capacity = 'Storage capacity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const managerOptions = [
    { value: '', label: 'No Manager Assigned' },
    ...managers?.map(manager => ({
      value: manager?.id,
      label: `${manager?.name} (${manager?.email})`
    }))
  ];

  const locationOptions = [
    { value: 'havana', label: 'Havana' },
    { value: 'santiago', label: 'Santiago de Cuba' },
    { value: 'camaguey', label: 'Camagüey' },
    { value: 'holguin', label: 'Holguín' },
    { value: 'matanzas', label: 'Matanzas' },
    { value: 'other', label: 'Other' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: 'Building' },
    { id: 'manager', label: 'Manager Assignment', icon: 'User' },
    { value: 'operations', label: 'Operations', icon: 'Settings' }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Warehouse Name"
                    type="text"
                    value={formData?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    error={errors?.name}
                    required
                    placeholder="Enter warehouse name"
                  />

                  <Select
                    label="Location"
                    options={locationOptions}
                    value={formData?.location}
                    onChange={(value) => handleInputChange('location', value)}
                    error={errors?.location}
                    required
                  />
                </div>

                <Input
                  label="Full Address"
                  type="text"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  error={errors?.address}
                  required
                  placeholder="Enter complete address"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    error={errors?.phone}
                    placeholder="+53 12345678"
                    description="Cuban phone number format"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    error={errors?.email}
                    placeholder="warehouse@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Storage Capacity (m³)"
                    type="number"
                    value={formData?.capacity}
                    onChange={(e) => handleInputChange('capacity', e?.target?.value)}
                    error={errors?.capacity}
                    required
                    placeholder="1000"
                    min="1"
                  />

                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData?.status}
                    onChange={(value) => handleInputChange('status', value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Manager Assignment Tab */}
            {activeTab === 'manager' && (
              <div className="space-y-6">
                <Select
                  label="Assigned Manager"
                  options={managerOptions}
                  value={formData?.managerId}
                  onChange={(value) => handleInputChange('managerId', value)}
                  description="Select a manager to assign to this warehouse"
                />

                {formData?.managerId && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Manager Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Icon name="User" size={14} />
                        <span className="text-muted-foreground">Name:</span>
                        <span className="text-foreground">
                          {managers?.find(m => m?.id === formData?.managerId)?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={14} />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground">
                          {managers?.find(m => m?.id === formData?.managerId)?.email || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={14} />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground">
                          {managers?.find(m => m?.id === formData?.managerId)?.phone || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Operations Tab */}
            {activeTab === 'operations' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Operating Hours</h4>
                  <div className="space-y-4">
                    {days?.map((day) => (
                      <div key={day} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-20">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {day}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!formData?.operatingHours?.[day]?.closed}
                            onChange={(e) => handleOperatingHoursChange(day, 'closed', !e?.target?.checked)}
                            className="rounded border-border"
                          />
                          <span className="text-sm text-muted-foreground">Open</span>
                        </div>

                        {!formData?.operatingHours?.[day]?.closed && (
                          <>
                            <Input
                              type="time"
                              value={formData?.operatingHours?.[day]?.open}
                              onChange={(e) => handleOperatingHoursChange(day, 'open', e?.target?.value)}
                              className="w-32"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={formData?.operatingHours?.[day]?.close}
                              onChange={(e) => handleOperatingHoursChange(day, 'close', e?.target?.value)}
                              className="w-32"
                            />
                          </>
                        )}

                        {formData?.operatingHours?.[day]?.closed && (
                          <span className="text-sm text-muted-foreground italic">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            iconName="Save"
          >
            {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseModal;