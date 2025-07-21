// Main pages exports
export { default as DatabaseDashboard } from './pages/DatabaseDashboard';
export { default as VehicleManagement } from './pages/VehicleManagement';
export { default as PilotManagement } from './pages/PilotManagement';
export { default as CustomerManagement } from './pages/CustomerManagement';
export { default as StaffManagement } from './pages/StaffManagement';
export { default as DataAnalytics } from './pages/DataAnalytics';

// Layout components
export { DatabaseLayout } from './components/DatabaseLayout';
export { DatabaseNavigationSidebar } from './components/DatabaseNavigationSidebar';

// Shared components
export { DataTable } from './components/shared/DataTable';
export { SearchAndFilter } from './components/shared/SearchAndFilter';
export { EmptyState } from './components/shared/EmptyState';

// Type exports for external use
export type { DataTableColumn, DataTableAction } from './components/shared/DataTable';
export type { FilterOption } from './components/shared/SearchAndFilter';
