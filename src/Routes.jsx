import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import InventoryManagement from './pages/inventory-management';
import TransferRequests from './pages/transfer-requests';
import LoginPage from './pages/login';
import ProductManagement from './pages/product-management';
import PointOfSale from './pages/point-of-sale';
import WarehouseManagement from './pages/warehouse-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<InventoryManagement />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/transfer-requests" element={<TransferRequests />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/point-of-sale" element={<PointOfSale />} />
        <Route path="/warehouse-management" element={<WarehouseManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
