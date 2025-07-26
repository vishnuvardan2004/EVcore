# EVCORE Role-Based Access Control System

## Overview
The EVCORE platform now includes a comprehensive role-based access control (RBAC) system that allows Super Admins to control which features are visible and accessible to different user roles.

## Components Created

### 1. Enhanced Admin Settings (`/admin-toggle`)
- **Access Level**: Super Admin only
- **Features**:
  - Tab-based interface for each role (Admin, Supervisor, Pilot)
  - Feature-level enable/disable controls
  - Granular permission management (view, create, edit, delete, export)
  - Real-time statistics and overview
  - Role overview cards showing feature access counts

### 2. Role Access Hook (`useRoleAccess.ts`)
```typescript
const { 
  canAccessFeature,
  canPerformAction,
  hasMinimumRole,
  isSuperAdmin 
} = useRoleAccess();
```

### 3. Protected Feature Component (`ProtectedFeature.tsx`)
```typescript
<ProtectedFeature 
  featureId="vehicle-deployment" 
  requiredRole="supervisor"
  requiredAction="edit"
>
  {/* Protected content */}
</ProtectedFeature>
```

### 4. Enhanced Authentication Context
- Added role hierarchy checking
- Feature access validation
- Permission-based controls

## Role Hierarchy

| Role | Level | Access |
|------|-------|--------|
| **Admin** | 3 | Full platform access, can manage all roles |
| **Supervisor** | 2 | Management features, limited admin access |
| **Pilot** | 1 | Basic operational features only |

## Feature Permissions Matrix

| Feature | Admin | Supervisor | Pilot |
|---------|-------|------------|-------|
| Vehicle Deployment | ✅ Full | ✅ View/Create/Edit/Export | ✅ View Only |
| Database Management | ✅ Full | ✅ View/Edit/Export | ❌ No Access |
| Driver Induction | ✅ Full | ✅ View/Create/Edit | ❌ No Access |
| Trip Details | ✅ Full | ✅ View/Edit/Export | ✅ View Only |
| Offline Bookings | ✅ Full | ✅ Full Access | ❌ No Access |
| Charging Tracker | ✅ Full | ✅ View/Edit/Export | ✅ View Only |
| Attendance | ✅ Full | ✅ View/Edit/Export | ❌ No Access |

## Usage Examples

### 1. Protecting a Feature Page
```typescript
import { withRoleProtection } from '@/components/ProtectedFeature';

const VehicleTracker = () => {
  // Component logic
};

export default withRoleProtection(VehicleTracker, 'vehicle-deployment', 'supervisor');
```

### 2. Conditional UI Elements
```typescript
const SomeComponent = () => {
  const { canPerformAction } = useRoleAccess();
  
  return (
    <div>
      {canPerformAction('database-management', 'create') && (
        <Button>Add New Record</Button>
      )}
    </div>
  );
};
```

### 3. Role-Based Dashboard Filtering
The dashboard now automatically filters features based on user permissions:
- Only shows accessible features
- Displays role-specific welcome message
- Shows feature access statistics

## Admin Settings Interface

### Super Admin Features:
1. **Role Management Tabs**: Switch between Admin, Supervisor, and Pilot views
2. **Feature Toggle**: Enable/disable entire features for specific roles
3. **Permission Granularity**: Control individual actions (view, create, edit, delete, export)
4. **Visual Feedback**: 
   - Green cards for enabled features
   - Permission grids showing detailed access
   - Real-time statistics
5. **Bulk Actions**: Save all changes at once

### Security Features:
- Only users with 'admin' role can access Admin Settings
- Access denied pages for insufficient permissions
- Automatic role verification on all protected routes
- Permission inheritance (admins have all permissions)

## Testing the System

### Test Users:
- **Admin**: `admin@example.com` / `admin123`
- **Supervisor**: `supervisor@example.com` / `super123`
- **Pilot**: `pilot@example.com` / `pilot123`

### Testing Steps:
1. Login as different role users
2. Observe different dashboard feature availability
3. Access Admin Settings as admin to modify permissions
4. Test feature access with different role configurations
5. Verify access denied messages for unauthorized access

## Benefits

1. **Security**: Granular control over feature access
2. **Flexibility**: Easy to modify permissions without code changes
3. **User Experience**: Users only see relevant features
4. **Scalability**: Easy to add new roles and permissions
5. **Audit Trail**: Clear visibility of who can access what

## Future Enhancements

1. **Permission Logging**: Track permission changes and access attempts
2. **Dynamic Permissions**: Time-based or condition-based access
3. **Custom Roles**: Allow creation of custom roles with specific permissions
4. **API Integration**: Connect to external role management systems
5. **Bulk User Management**: Import/export user permissions

This system provides a solid foundation for secure, role-based access control in the EVCORE platform while maintaining flexibility for future requirements.
