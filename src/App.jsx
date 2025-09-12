import { useState } from 'react'
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import InventoryGrid from "./components/InventoryGrid";

function App() {
  const [selected, setSelected] = useState("Computers");

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-20">
        <Header />
        <FilterBar selected={selected} onSelect={setSelected} />
        <InventoryGrid category={selected} />
      </main>
    </div>
  )
}

export default App