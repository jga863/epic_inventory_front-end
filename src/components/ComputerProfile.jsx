import React, { useEffect, useState } from 'react';
import { getComputerSummary } from '../services/computersApi';
import epicComputer from '../assets/epic_computer.png';
import epicEmployee from '../assets/epic_employee.png';

const ComputerProfile = ({ computerId, onBack }) => {
  const [computerData, setComputerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComputerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComputerSummary(computerId);
        setComputerData(data);
      } catch (err) {
        console.error('Error loading computer data:', err);
        setError('Error loading computer information');
      } finally {
        setLoading(false);
      }
    };

    if (computerId) {
      loadComputerData();
    }
  }, [computerId]);

  if (loading) {
    return (
      <div className="px-8 py-4 text-gray-800">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-600 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to computer list
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading computer information...</p>
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
            className="flex items-center text-yellow-600 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to computer list
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!computerData || !computerData.computer) {
    return (
      <div className="px-8 py-4 text-gray-800">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-600 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to computer list
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-6xl mb-4">💻</div>
          <p className="text-gray-600 mb-4">Computer not found</p>
        </div>
      </div>
    );
  }

  const { computer, employee, assignment } = computerData;

  return (
    <div className="px-8 py-4 text-gray-800">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-yellow-600 hover:text-yellow-800 mb-4 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to computer list
        </button>
      </div>

      {/* Main computer card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with computer image and basic info */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-50 px-8 py-6 text-white">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
              <img 
                src={epicComputer} 
                alt="Computer" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{computer.name || 'Name not available'}</h1>
              <p className="text-yellow-100 text-lg">{computer.model || 'Model not specified'}</p>
              <p className="text-yellow-200">ID: {computer.id}</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Basic Information
              </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Model:</span>
                    <span className="text-gray-800">{computer.model || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="text-gray-800">{computer.name || '—'}</span>
                  </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Serial Number:</span>
                  <span className="text-gray-800 font-mono text-sm">{computer.serialNo || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Computer ID:</span>
                  <span className="text-gray-800">{computer.id || '—'}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Location Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Office:</span>
                  <span className="text-gray-800">{computer.office || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Division:</span>
                  <span className="text-gray-800">{computer.division || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <span className="font-medium text-gray-700">Processor</span>
                </div>
                <p className="text-gray-600 text-sm">{computer.processor || '—'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span className="font-medium text-gray-700">RAM</span>
                </div>
                <p className="text-gray-600 text-sm">{computer.ram || '—'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Operating System</span>
                </div>
                <p className="text-gray-600 text-sm">{computer.os || '—'}</p>
              </div>
            </div>
          </div>

          {/* Assigned Employee Section */}
          {employee ? (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Assigned Employee
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
                    <img 
                      src={epicEmployee} 
                      alt="Employee" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {employee.fullName || 'Unnamed Employee'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-800">{employee.email || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Department:</span>
                        <span className="ml-2 text-gray-800">{employee.department || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Office:</span>
                        <span className="ml-2 text-gray-800">{employee.office || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Role:</span>
                        <span className="ml-2 text-gray-800">{employee.role || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : employee.status === 'Inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.status || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Employee ID:</span>
                        <span className="ml-2 text-gray-800">{employee.id || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Assigned Employee
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-gray-400 text-4xl mb-2">👤</div>
                <p className="text-gray-600">No employee assigned to this computer</p>
              </div>
            </div>
          )}

          {/* Assignment Information */}
          {assignment && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Assignment Information
              </h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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

export default ComputerProfile;
