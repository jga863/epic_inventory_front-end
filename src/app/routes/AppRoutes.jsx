import { Routes, Route } from 'react-router-dom';
import Login from '../Login';
import Layout from '../layouts/Layout';
import InventoryPage from '../../modules/inventory/pages/InventoryPage';
import EmployeesPage from '../../modules/employees/pages/EmployeesPage';
import ComputersPage from '../../modules/computers/pages/ComputersPage';
import AssignmentsPage from '../../modules/assignments/pages/AssignmentsPage';
import MonitorsPage from '../../modules/monitors/pages/MonitorsPage';
import BatteryBackupPage from '../../modules/battery-backup/pages/BatteryBackupPage';
import PeripheralsPage from '../../modules/peripherals/pages/PeripheralsPage';
import SurveysPage from '../../modules/surveys/pages/SurveysPage';
import AssetDemoPage from '../../modules/dev/pages/AssetDemoPage';
import ProtectedRoute from './ProtectedRoute';
import { ACTIONS, MODULES } from '../../shared/constants/permissions';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={(
            <ProtectedRoute
              permissions={[
                { module: MODULES.EMPLOYEES, action: ACTIONS.VIEW },
                { module: MODULES.COMPUTERS, action: ACTIONS.VIEW },
                { module: MODULES.ASSIGNMENTS, action: ACTIONS.VIEW },
              ]}
              requireAny
            >
              <InventoryPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="inventory"
          element={(
            <ProtectedRoute
              permissions={[
                { module: MODULES.EMPLOYEES, action: ACTIONS.VIEW },
                { module: MODULES.COMPUTERS, action: ACTIONS.VIEW },
                { module: MODULES.ASSIGNMENTS, action: ACTIONS.VIEW },
              ]}
              requireAny
            >
              <InventoryPage />
            </ProtectedRoute>
          )}
        />
        <Route path="employees" element={<ProtectedRoute permission={{ module: MODULES.EMPLOYEES, action: ACTIONS.VIEW }}><EmployeesPage /></ProtectedRoute>} />
        <Route path="computers" element={<ProtectedRoute permission={{ module: MODULES.COMPUTERS, action: ACTIONS.VIEW }}><ComputersPage /></ProtectedRoute>} />
        <Route path="assignments" element={<ProtectedRoute permission={{ module: MODULES.ASSIGNMENTS, action: ACTIONS.VIEW }}><AssignmentsPage /></ProtectedRoute>} />
        <Route path="monitors" element={<ProtectedRoute permission={{ module: MODULES.MONITORS, action: ACTIONS.VIEW }}><MonitorsPage /></ProtectedRoute>} />
        <Route path="battery-backups" element={<ProtectedRoute permission={{ module: MODULES.BATTERY_BACKUPS, action: ACTIONS.VIEW }}><BatteryBackupPage /></ProtectedRoute>} />
        <Route path="peripherals" element={<ProtectedRoute permission={{ module: MODULES.PERIPHERALS, action: ACTIONS.VIEW }}><PeripheralsPage /></ProtectedRoute>} />
        <Route path="surveys" element={<ProtectedRoute permission={{ module: MODULES.SURVEYS, action: ACTIONS.VIEW }}><SurveysPage /></ProtectedRoute>} />
        {import.meta.env.DEV ? <Route path="dev/asset-demo" element={<AssetDemoPage />} /> : null}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
