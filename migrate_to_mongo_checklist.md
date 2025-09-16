# MongoDB Migration Checklist for WareFlow System

## Overview
This document provides comprehensive documentation of all MongoDB endpoints, data models, and migration strategies needed to migrate the WareFlow warehouse management system from the current architecture to MongoDB.

## Table of Contents
1. [Data Models & Collections](#data-models--collections)
2. [MongoDB Endpoints by Module](#mongodb-endpoints-by-module)
3. [Migration Strategy](#migration-strategy)
4. [Database Schema Design](#database-schema-design)
5. [Indexing Strategy](#indexing-strategy)
6. [Security Considerations](#security-considerations)

---

## Data Models & Collections

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String, // Unique index
  password: String, // Hashed
  role: String, // "owner", "manager", "staff"
  profile: {
    name: String,
    phone: String,
    avatar: String,
    address: String
  },
  permissions: [String],
  warehouseAccess: [ObjectId], // References to warehouse IDs
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  isActive: Boolean
}
```

### 2. Warehouses Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: {
    city: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String
  },
  manager: {
    id: ObjectId, // Reference to Users
    name: String,
    email: String,
    phone: String
  },
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  capacity: String,
  status: String, // "active", "inactive", "maintenance"
  stats: {
    inventoryValue: Number,
    totalProducts: Number
  },
  createdAt: Date,
  updatedAt: Date,
  lastActivity: Date
}
```

### 3. Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  sku: String, // Unique index
  description: String,
  category: String,
  globalPrice: Number,
  costPrice: Number,
  isActive: Boolean,
  warehousePrices: {
    [warehouseId]: Number
  },
  inventoryLevels: {
    [warehouseId]: {
      currentStock: Number,
      reservedStock: Number,
      availableStock: Number,
      minThreshold: Number,
      maxThreshold: Number,
      reorderPoint: Number,
      location: String // Storage location within warehouse
    }
  },
  totalStock: Number,
  unit: String,
  barcode: String,
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  metadata: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  createdAt: Date,
  updatedAt: Date,
  lastUpdated: Date
}
```

### 4. Inventory Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId, // Reference to Products
  warehouseId: ObjectId, // Reference to Warehouses
  currentStock: Number,
  reservedStock: Number,
  availableStock: Number,
  minThreshold: Number,
  maxThreshold: Number,
  reorderPoint: Number,
  costPrice: Number,
  sellingPrice: Number,
  stockValue: Number,
  location: String, // Storage location code
  lastCountDate: Date,
  lastAdjustment: {
    date: Date,
    quantity: Number,
    reason: String,
    performedBy: ObjectId // Reference to Users
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Transfer Requests Collection
```javascript
{
  _id: ObjectId,
  requestId: String, // "TR-YYYY####" format
  sourceWarehouse: {
    id: ObjectId,
    name: String
  },
  destinationWarehouse: {
    id: ObjectId,
    name: String
  },
  products: [{
    id: ObjectId, // Reference to Products
    name: String,
    sku: String,
    quantity: Number,
    price: Number
  }],
  status: String, // "pending", "approved", "rejected", "in-transit", "completed"
  justification: String,
  totalValue: Number,
  createdBy: {
    id: ObjectId, // Reference to Users
    name: String
  },
  approvedBy: {
    id: ObjectId, // Reference to Users
    name: String,
    date: Date
  },
  completedAt: Date,
  history: [{
    action: String,
    status: String,
    user: String,
    timestamp: Date,
    comment: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Sales Collection
```javascript
{
  _id: ObjectId,
  invoiceNumber: String, // Unique
  warehouseId: ObjectId, // Reference to Warehouses
  customer: {
    id: ObjectId, // Optional reference to Customers
    name: String,
    email: String,
    phone: String,
    address: String,
    loyaltyPoints: Number,
    discountTier: String
  },
  items: [{
    productId: ObjectId, // Reference to Products
    name: String,
    sku: String,
    quantity: Number,
    price: Number,
    category: String
  }],
  totals: {
    subtotal: Number,
    discountAmount: Number,
    tax: Number,
    total: Number,
    itemCount: Number
  },
  payment: {
    method: String, // "cash", "card", "digital"
    amount: Number,
    change: Number
  },
  discount: {
    type: String, // "none", "percentage", "fixed", "customer"
    value: Number
  },
  cashier: {
    id: ObjectId, // Reference to Users
    name: String
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Customers Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  loyaltyPoints: Number,
  discountTier: String, // "bronze", "silver", "gold", "platinum"
  discountRate: Number,
  totalPurchases: Number,
  totalSpent: Number,
  lastPurchase: Date,
  preferences: {
    categories: [String],
    paymentMethod: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Stock History Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId, // Reference to Products
  warehouseId: ObjectId, // Reference to Warehouses
  type: String, // "adjustment", "sale", "transfer-in", "transfer-out", "return", "damage"
  description: String,
  stockChange: Number, // Positive or negative
  stockBefore: Number,
  stockAfter: Number,
  performedBy: {
    id: ObjectId, // Reference to Users
    name: String
  },
  reference: String, // Invoice/Transfer/Adjustment ID
  notes: String,
  costPrice: Number,
  location: String,
  timestamp: Date,
  createdAt: Date
}
```

---

## MongoDB Endpoints by Module

### Authentication Module

#### POST `/api/auth/login`
- **Purpose**: User authentication
- **Body**: `{ email: String, password: String }`
- **MongoDB Query**: `db.users.findOne({ email, isActive: true })`

#### POST `/api/auth/logout`
- **Purpose**: User logout
- **MongoDB Query**: `db.users.updateOne({ _id }, { $set: { lastLoginAt: new Date() } })`

#### GET `/api/auth/me`
- **Purpose**: Get current user profile
- **MongoDB Query**: `db.users.findOne({ _id }, { password: 0 })`

### Warehouses Module

#### GET `/api/warehouses`
- **Purpose**: Get all warehouses
- **MongoDB Query**: `db.warehouses.find({ isActive: true }).sort({ name: 1 })`

#### GET `/api/warehouses/:id`
- **Purpose**: Get warehouse by ID
- **MongoDB Query**: `db.warehouses.findOne({ _id: ObjectId(id) })`

#### POST `/api/warehouses`
- **Purpose**: Create new warehouse
- **MongoDB Query**: `db.warehouses.insertOne(warehouseData)`

#### PUT `/api/warehouses/:id`
- **Purpose**: Update warehouse
- **MongoDB Query**: `db.warehouses.updateOne({ _id: ObjectId(id) }, { $set: updates })`

#### DELETE `/api/warehouses/:id`
- **Purpose**: Delete warehouse
- **MongoDB Query**: `db.warehouses.updateOne({ _id: ObjectId(id) }, { $set: { status: 'inactive' } })`

#### GET `/api/warehouses/:id/stats`
- **Purpose**: Get warehouse statistics
- **MongoDB Aggregation**:
```javascript
db.inventory.aggregate([
  { $match: { warehouseId: ObjectId(id) } },
  {
    $group: {
      _id: null,
      totalProducts: { $sum: 1 },
      totalValue: { $sum: "$stockValue" },
      lowStockItems: {
        $sum: {
          $cond: [
            { $and: [{ $lte: ["$currentStock", "$minThreshold"] }, { $gt: ["$currentStock", 0] }] },
            1, 0
          ]
        }
      }
    }
  }
])
```

### Products Module

#### GET `/api/products`
- **Purpose**: Get all products with filters
- **MongoDB Query**: 
```javascript
db.products.find({
  $and: [
    searchQuery,
    categoryFilter,
    statusFilter,
    priceRangeFilter
  ]
}).sort(sortConfig)
```

#### GET `/api/products/:id`
- **Purpose**: Get product by ID
- **MongoDB Query**: `db.products.findOne({ _id: ObjectId(id) })`

#### POST `/api/products`
- **Purpose**: Create new product
- **MongoDB Query**: `db.products.insertOne(productData)`

#### PUT `/api/products/:id`
- **Purpose**: Update product
- **MongoDB Query**: `db.products.updateOne({ _id: ObjectId(id) }, { $set: updates })`

#### GET `/api/products/:id/price-history`
- **Purpose**: Get product price history
- **MongoDB Aggregation**:
```javascript
db.stockHistory.aggregate([
  { $match: { productId: ObjectId(id) } },
  { $sort: { timestamp: -1 } },
  { $limit: 50 }
])
```

#### POST `/api/products/bulk-import`
- **Purpose**: Import products in bulk
- **MongoDB Query**: `db.products.insertMany(products)`

### Inventory Module

#### GET `/api/inventory`
- **Purpose**: Get inventory with filters
- **MongoDB Aggregation**:
```javascript
db.inventory.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $lookup: {
      from: "warehouses",
      localField: "warehouseId",
      foreignField: "_id",
      as: "warehouse"
    }
  },
  { $match: filters },
  { $sort: sortConfig }
])
```

#### POST `/api/inventory/adjust`
- **Purpose**: Adjust inventory levels
- **MongoDB Transaction**:
```javascript
session.withTransaction(async () => {
  await db.inventory.updateOne({ _id }, { $set: { currentStock: newStock } });
  await db.stockHistory.insertOne(historyRecord);
});
```

#### GET `/api/inventory/:productId/:warehouseId/history`
- **Purpose**: Get stock movement history
- **MongoDB Query**: 
```javascript
db.stockHistory.find({
  productId: ObjectId(productId),
  warehouseId: ObjectId(warehouseId)
}).sort({ timestamp: -1 })
```

### Transfer Requests Module

#### GET `/api/transfer-requests`
- **Purpose**: Get transfer requests with filters
- **MongoDB Query**:
```javascript
db.transferRequests.find(filters).sort({ createdAt: -1 })
```

#### GET `/api/transfer-requests/:id`
- **Purpose**: Get transfer request by ID
- **MongoDB Query**: `db.transferRequests.findOne({ _id: ObjectId(id) })`

#### POST `/api/transfer-requests`
- **Purpose**: Create transfer request
- **MongoDB Query**: `db.transferRequests.insertOne(requestData)`

#### PUT `/api/transfer-requests/:id/approve`
- **Purpose**: Approve transfer request
- **MongoDB Query**:
```javascript
db.transferRequests.updateOne(
  { _id: ObjectId(id) },
  {
    $set: { status: 'approved', approvedBy: approver },
    $push: { history: historyEntry }
  }
)
```

#### PUT `/api/transfer-requests/:id/reject`
- **Purpose**: Reject transfer request
- **MongoDB Query**:
```javascript
db.transferRequests.updateOne(
  { _id: ObjectId(id) },
  {
    $set: { status: 'rejected' },
    $push: { history: historyEntry }
  }
)
```

#### PUT `/api/transfer-requests/:id/complete`
- **Purpose**: Complete transfer request
- **MongoDB Transaction**:
```javascript
session.withTransaction(async () => {
  // Update transfer status
  await db.transferRequests.updateOne({ _id }, { $set: { status: 'completed' } });
  
  // Update inventory levels
  for (const item of items) {
    await db.inventory.updateOne(
      { productId: item.id, warehouseId: sourceWarehouse },
      { $inc: { currentStock: -item.quantity } }
    );
    await db.inventory.updateOne(
      { productId: item.id, warehouseId: destinationWarehouse },
      { $inc: { currentStock: item.quantity } }
    );
  }
  
  // Create stock history entries
  await db.stockHistory.insertMany(historyEntries);
});
```

### Point of Sale Module

#### GET `/api/products/search`
- **Purpose**: Search products for POS
- **MongoDB Query**:
```javascript
db.products.find({
  $or: [
    { name: { $regex: searchTerm, $options: 'i' } },
    { sku: { $regex: searchTerm, $options: 'i' } },
    { barcode: searchTerm }
  ],
  isActive: true
})
```

#### POST `/api/sales`
- **Purpose**: Process sale transaction
- **MongoDB Transaction**:
```javascript
session.withTransaction(async () => {
  // Create sale record
  const sale = await db.sales.insertOne(saleData);
  
  // Update inventory levels
  for (const item of items) {
    await db.inventory.updateOne(
      { productId: item.productId, warehouseId },
      { $inc: { currentStock: -item.quantity } }
    );
  }
  
  // Create stock history entries
  await db.stockHistory.insertMany(stockMovements);
  
  // Update customer loyalty points if customer exists
  if (customerId) {
    await db.customers.updateOne(
      { _id: ObjectId(customerId) },
      {
        $inc: { loyaltyPoints: pointsEarned, totalSpent: total },
        $set: { lastPurchase: new Date() }
      }
    );
  }
});
```

#### GET `/api/sales/:id/receipt`
- **Purpose**: Get sale receipt data
- **MongoDB Query**: `db.sales.findOne({ _id: ObjectId(id) })`

### Customers Module

#### GET `/api/customers`
- **Purpose**: Get customers list
- **MongoDB Query**: `db.customers.find().sort({ name: 1 })`

#### GET `/api/customers/:id`
- **Purpose**: Get customer by ID
- **MongoDB Query**: `db.customers.findOne({ _id: ObjectId(id) })`

#### POST `/api/customers`
- **Purpose**: Create new customer
- **MongoDB Query**: `db.customers.insertOne(customerData)`

#### PUT `/api/customers/:id`
- **Purpose**: Update customer
- **MongoDB Query**: `db.customers.updateOne({ _id: ObjectId(id) }, { $set: updates })`

### Analytics & Reporting Module

#### GET `/api/analytics/sales-summary`
- **Purpose**: Get sales summary analytics
- **MongoDB Aggregation**:
```javascript
db.sales.aggregate([
  { $match: { createdAt: { $gte: dateFrom, $lte: dateTo } } },
  {
    $group: {
      _id: null,
      totalSales: { $sum: "$totals.total" },
      totalTransactions: { $sum: 1 },
      averageOrderValue: { $avg: "$totals.total" }
    }
  }
])
```

#### GET `/api/analytics/inventory-report`
- **Purpose**: Get inventory analytics
- **MongoDB Aggregation**:
```javascript
db.inventory.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $group: {
      _id: "$product.category",
      totalValue: { $sum: "$stockValue" },
      totalProducts: { $sum: 1 },
      lowStockItems: {
        $sum: {
          $cond: [{ $lte: ["$currentStock", "$minThreshold"] }, 1, 0]
        }
      }
    }
  }
])
```

---

## Migration Strategy

### Phase 1: Data Export & Schema Creation
1. **Export existing data** from current system
2. **Create MongoDB collections** with proper schemas
3. **Set up indexes** for performance optimization
4. **Configure replica set** for high availability

### Phase 2: Data Transformation & Import
1. **Transform data** to match MongoDB schema
2. **Import data** into respective collections
3. **Verify data integrity** and relationships
4. **Create initial admin user** and warehouse data

### Phase 3: API Implementation
1. **Implement MongoDB connection** and configuration
2. **Create API endpoints** as documented above
3. **Add authentication middleware** and validation
4. **Implement error handling** and logging

### Phase 4: Testing & Validation
1. **Unit testing** for all endpoints
2. **Integration testing** for workflows
3. **Performance testing** under load
4. **Data validation** and consistency checks

### Phase 5: Deployment & Monitoring
1. **Deploy to production** environment
2. **Set up monitoring** and alerts
3. **Configure backup** and recovery procedures
4. **User training** and documentation

---

## Database Schema Design

### Collection Relationships
```javascript
Users (1) -> (N) Warehouses (manager relationship)
Warehouses (1) -> (N) Inventory
Products (1) -> (N) Inventory
Products (1) -> (N) Sales.items
Warehouses (1) -> (N) Sales
Users (1) -> (N) Sales (cashier relationship)
Warehouses (1) -> (N) TransferRequests (source/destination)
Products (N) -> (N) TransferRequests.products
Users (1) -> (N) StockHistory
```

### Data Consistency Rules
1. **Inventory levels** must be updated atomically with sales and transfers
2. **Stock history** must be created for every inventory change
3. **Transfer requests** must validate stock availability before approval
4. **Product prices** must be consistent across warehouses unless overridden

---

## Indexing Strategy

### Primary Indexes
```javascript
// Users Collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// Products Collection
db.products.createIndex({ "sku": 1 }, { unique: true })
db.products.createIndex({ "name": "text", "description": "text" })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "isActive": 1 })

// Warehouses Collection
db.warehouses.createIndex({ "name": 1 })
db.warehouses.createIndex({ "location.city": 1 })
db.warehouses.createIndex({ "status": 1 })

// Inventory Collection
db.inventory.createIndex({ "productId": 1, "warehouseId": 1 }, { unique: true })
db.inventory.createIndex({ "warehouseId": 1 })
db.inventory.createIndex({ "currentStock": 1 })

// Sales Collection
db.sales.createIndex({ "invoiceNumber": 1 }, { unique: true })
db.sales.createIndex({ "warehouseId": 1 })
db.sales.createIndex({ "createdAt": -1 })
db.sales.createIndex({ "customer.id": 1 })

// Transfer Requests Collection
db.transferRequests.createIndex({ "requestId": 1 }, { unique: true })
db.transferRequests.createIndex({ "sourceWarehouse.id": 1 })
db.transferRequests.createIndex({ "destinationWarehouse.id": 1 })
db.transferRequests.createIndex({ "status": 1 })
db.transferRequests.createIndex({ "createdAt": -1 })

// Stock History Collection
db.stockHistory.createIndex({ "productId": 1, "warehouseId": 1 })
db.stockHistory.createIndex({ "timestamp": -1 })
db.stockHistory.createIndex({ "type": 1 })

// Customers Collection
db.customers.createIndex({ "email": 1 }, { unique: true })
db.customers.createIndex({ "phone": 1 })
db.customers.createIndex({ "name": 1 })
```

---

## Security Considerations

### Authentication & Authorization
1. **JWT tokens** for API authentication
2. **Role-based access control** (RBAC)
3. **Warehouse-level permissions** for managers
4. **API rate limiting** to prevent abuse

### Data Protection
1. **Password hashing** using bcrypt
2. **Sensitive data encryption** at rest
3. **SSL/TLS** for data in transit
4. **Input validation** and sanitization

### MongoDB Security
1. **Authentication** enabled on MongoDB
2. **Authorization** with specific user roles
3. **Network security** with IP whitelisting
4. **Regular backups** with encryption

### API Security Headers
```javascript
// Required security headers
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': "default-src 'self'"
}
```

---

## Environment Configuration

### MongoDB Connection
```javascript
// Production connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wareflow?retryWrites=true&w=majority

// Development connection string  
MONGODB_URI_DEV=mongodb://localhost:27017/wareflow_dev

// Connection options
MONGODB_OPTIONS={
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### API Configuration
```javascript
// JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

// API Configuration
API_PORT=3000
API_HOST=localhost
NODE_ENV=production

// Rate Limiting
RATE_LIMIT_WINDOW=15 // minutes
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Migration Timeline

### Week 1: Setup & Planning
- Set up MongoDB cluster
- Create database schemas
- Plan data migration scripts

### Week 2: Data Migration
- Export existing data
- Transform and import data
- Verify data integrity

### Week 3: API Development
- Implement core endpoints
- Add authentication/authorization
- Create validation middleware

### Week 4: Testing
- Unit and integration testing
- Performance optimization
- Security testing

### Week 5: Deployment
- Deploy to staging environment
- User acceptance testing
- Production deployment

---

## Backup & Recovery

### Backup Strategy
1. **Daily automated backups** of entire database
2. **Point-in-time recovery** capability
3. **Cross-region backup** replication
4. **Backup encryption** and compression

### Recovery Procedures
1. **Database restoration** from backup
2. **Data consistency** verification
3. **Application restart** procedures
4. **User notification** protocols

---

## Monitoring & Maintenance

### Key Metrics to Monitor
1. **Database performance** (query times, connections)
2. **API response times** and error rates
3. **Storage usage** and growth patterns
4. **User activity** and session metrics

### Maintenance Tasks
1. **Index optimization** monthly
2. **Data cleanup** of old records
3. **Performance tuning** quarterly
4. **Security updates** as needed

---

This comprehensive checklist provides all the necessary information to successfully migrate the WareFlow system to MongoDB, including detailed endpoints, data models, security considerations, and implementation strategies.