import React from 'react';
import ComputerList from './ComputerList';
import ComputerFormFields from './ComputerFormFields';
import FormError from '../../../shared/components/forms/FormError';
import FormActions from '../../../shared/components/forms/FormActions';
import useComputerUpdate from '../../../hooks/useComputerUpdate';

const UpdateComputerPanel = ({ onBack, onSuccess }) => {
  const {
    // List state
    computers,
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

    // Handlers
    fetchComputers,
    handleSelect,
    handleChange,
    handleSubmit,
  } = useComputerUpdate(onSuccess);

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
            Updated
          </span>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">Select a computer to edit</h2>
          <p className="mt-1 text-sm text-gray-500">Choose a record from the list and adjust the information on the right.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <ComputerList
            computers={computers}
            listLoading={listLoading}
            listError={listError}
            selectedId={selectedId}
            onSelectComputer={handleSelect}
            onRefresh={fetchComputers}
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
                  Loading computer information...
                </div>
              ) : (
                <>
                  <ComputerFormFields
                    form={form}
                    errors={errors}
                    handleChange={handleChange}
                    isDisabled={!selectedId || saving}
                    officeOptions={officeOptions}
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

export default UpdateComputerPanel;


