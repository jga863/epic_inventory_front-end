import React from 'react';
import EmployeeList from './EmployeeList';
import EmployeeFormFields from './EmployeeFormFields';
import FormError from '../../../shared/components/forms/FormError';
import FormActions from '../../../shared/components/forms/FormActions';
import useEmployeeUpdate from '../../../hooks/useEmployeeUpdate';

const UpdateEmployeePanel = ({ onBack, onSuccess }) => {
  const {
    // List state
    employees,
    listLoading,
    listError,

    // Form state
    selectedId,
    form,
    formLoading,
    errors,
    formError,
    saving,

    // Options
    officeOptions,
    statusOptions,

    // Handlers
    fetchEmployees,
    handleSelect,
    handleChange,
    handleSubmit,
  } = useEmployeeUpdate(onSuccess);

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
            Updated
          </span>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">Select an employee to edit</h2>
          <p className="mt-1 text-sm text-gray-500">Choose a record from the list and adjust the information on the right.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <EmployeeList
            employees={employees}
            listLoading={listLoading}
            listError={listError}
            selectedId={selectedId}
            onSelectEmployee={handleSelect}
            onRefresh={fetchEmployees}
            onBack={onBack}
          />

          <div className="lg:col-span-2">
            <form
              className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6"
              onSubmit={handleSubmit}
            >
              <h3 className="text-sm font-semibold text-gray-700">Edit information</h3>

              {formLoading ? (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  Loading employee information...
                </div>
              ) : (
                <>
                  <EmployeeFormFields
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    isDisabled={!selectedId || saving}
                    officeOptions={officeOptions}
                    statusOptions={statusOptions}
                  />

                  <FormError error={formError} className="mt-4" />

                  <FormActions
                    onCancel={onBack}
                    onSubmit={handleSubmit}
                    submitLabel="Save changes"
                    cancelLabel="Back"
                    isSubmitting={saving}
                    submitDisabled={!selectedId || saving || formLoading}
                    className="mt-6"
                  />
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployeePanel;


