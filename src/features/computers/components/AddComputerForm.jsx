import React from 'react';
import FormError from '../../../shared/components/forms/FormError';
import FormActions from '../../../shared/components/forms/FormActions';
import ComputerFormFields from './ComputerFormFields';
import useComputerForm from '../../../hooks/useComputerForm';

const AddComputerForm = ({ isOpen, onClose, onSuccess }) => {
  const {
    form,
    errors,
    formError,
    isSubmitting,
    handleChange,
    handleSubmit,
    officeOptions,
  } = useComputerForm(isOpen, onClose, onSuccess);

  if (!isOpen) {
    return null;
  }

  return (
    <section className="px-8 pb-12 text-gray-800 mt-6">
      <div className="mx-auto w-full max-w-4xl">
        <header className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add computer</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete the information to register a new computer.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <FormError error={formError} />

          <ComputerFormFields
            form={form}
            errors={errors}
            handleChange={handleChange}
            isSubmitting={isSubmitting}
            officeOptions={officeOptions}
          />

          <FormActions
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitLabel="Add computer"
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </section>
  );
};

export default AddComputerForm;
