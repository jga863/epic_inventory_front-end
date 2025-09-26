import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStateProvider from '../context/GlobalStateProvider';
import Layout from './layout/Layout';
import InventoryPage from '../features/inventory/pages/InventoryPage';
import EmployeesPage from '../features/employees/pages/EmployeesPage';
import ComputersPage from '../features/computers/pages/ComputersPage';
import AssignmentsPage from '../features/assignments/pages/AssignmentsPage';

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<InventoryPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="computers" element={<ComputersPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
          </Route>
        </Routes>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;



















