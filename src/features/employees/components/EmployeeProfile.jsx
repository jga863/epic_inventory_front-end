import React, { useEffect, useState } from 'react';
import { getEmployeeSummary } from '../../../services/employeesApi';
import epicEmployee from '../../../assets/epic_employee.png';
import epicComputer from '../../../assets/epic_computer.png';

// TODO: RENDIMIENTO - Agregar React.memo para evitar re-renders innecesarios
// Similar a ComputerProfile, este componente necesita memoización
const EmployeeProfile = ({ employeeId, onBack }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEmployeeSummary(employeeId);
        setEmployeeData(data);
      } catch (err) {
        console.error('Error loading employee data:', err);
        setError('Error loading employee information');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  if (loading) {
    return (
      <div className="px-8 py-4 text-gray-800">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-700 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg border border-yellow-400 bg-white hover:bg-yellow-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to employee list
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-4 text-gray-800">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-700 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg border border-yellow-400 bg-white hover:bg-yellow-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to employee list
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!employeeData || !employeeData.employee) {
    return (
      <div className="px-8 py-4 text-gray-800">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-700 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg border border-yellow-400 bg-white hover:bg-yellow-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to employee list
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <p className="text-gray-600 mb-4">Employee not found</p>
        </div>
      </div>
    );
  }

  const { employee, computer, assignment } = employeeData;

  return (
    <div className="px-8 py-4 text-gray-800">
      {/* Botón de volver integrado */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-yellow-700 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg border border-yellow-400 bg-white hover:bg-yellow-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to employee list
        </button>
      </div>

      {/* Tarjeta principal del empleado */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-4 md:mx-0">
        {/* Header con foto y nombre */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-50 px-8 py-6 text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mr-4 md:mr-6">
              <img
                src={epicEmployee}
                alt="Employee"
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold">{employee.fullName || 'Name not available'}</h1>
              <p className="text-blue-100 text-sm md:text-lg">{employee.department || 'Department not specified'}</p>
              <p className="text-blue-200 text-sm">ID: {employee.id}</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Full Name:</span>
                  <span className="text-gray-800">{employee.fullName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">{employee.email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Employee ID:</span>
                  <span className="text-gray-800">{employee.id || '—'}</span>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Work Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Department:</span>
                  <span className="text-gray-800">{employee.department || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Office:</span>
                  <span className="text-gray-800">{employee.office || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Role:</span>
                  <span className="text-gray-800">{employee.role || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : employee.status === 'Inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.status || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Computer Section */}
          {computer ? (
            <div className="mt-4 md:mt-8">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Assigned Computer
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
                    <img 
                      src={epicComputer} 
                      alt="Computer" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {computer.name || 'Unnamed Computer'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Model:</span>
                        <span className="ml-2 text-gray-800">{computer.model || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Serial Number:</span>
                        <span className="ml-2 text-gray-800 font-mono">{computer.serialNo || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Office:</span>
                        <span className="ml-2 text-gray-800">{computer.office || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Division:</span>
                        <span className="ml-2 text-gray-800">{computer.division || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Processor:</span>
                        <span className="ml-2 text-gray-800">{computer.processor || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">RAM:</span>
                        <span className="ml-2 text-gray-800">{computer.ram || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">OS:</span>
                        <span className="ml-2 text-gray-800">{computer.os || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Assigned Computer
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-gray-400 text-4xl mb-2">💻</div>
                <p className="text-gray-600">No computer assigned to this employee</p>
              </div>
            </div>
          )}

          {/* Assignment Information */}
          {assignment && (
            <div className="mt-4 md:mt-8">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Assignment Information
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Assignment ID:</span>
                    <span className="ml-2 text-gray-800">{assignment.id || '—'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Employee ID:</span>
                    <span className="ml-2 text-gray-800">{assignment.employeeId || '—'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Computer ID:</span>
                    <span className="ml-2 text-gray-800">{assignment.computerId || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;