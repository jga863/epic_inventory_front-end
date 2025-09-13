import { useState } from 'react'
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import InventoryGrid from "./components/InventoryGrid";
import EmployeeProfile from "./components/EmployeeProfile";
import ComputerProfile from "./components/ComputerProfile";

function App() {
  const [selected, setSelected] = useState("Computers");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedComputer, setSelectedComputer] = useState(null);

  // Función para manejar el click en un empleado
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee.id); // Solo pasar el ID
    setSelectedComputer(null); // Clear computer selection
  };

  // Función para manejar el click en una computadora
  const handleComputerClick = (computer) => {
    setSelectedComputer(computer.id); // Solo pasar el ID
    setSelectedEmployee(null); // Clear employee selection
  };

  // Función para volver a la lista
  const handleBackToList = () => {
    setSelectedEmployee(null);
    setSelectedComputer(null);
  };

  // Si hay un empleado seleccionado, mostrar su perfil
  if (selectedEmployee) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 ml-20">
          <Header />
          <EmployeeProfile 
            employeeId={selectedEmployee} 
            onBack={handleBackToList}
          />
        </main>
      </div>
    );
  }

  // Si hay una computadora seleccionada, mostrar su perfil
  if (selectedComputer) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 ml-20">
          <Header />
          <ComputerProfile 
            computerId={selectedComputer} 
            onBack={handleBackToList}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-20">
        <Header />
        <FilterBar selected={selected} onSelect={setSelected} />
        <InventoryGrid 
          category={selected} 
          onEmployeeClick={handleEmployeeClick}
          onComputerClick={handleComputerClick}
        />
      </main>
    </div>
  )
}

export default App