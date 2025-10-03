import React from 'react';
import FormField from '../../../shared/components/forms/FormField';

const ComputerFormFields = ({
  form,
  errors,
  handleChange,
  isDisabled,
  officeOptions
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 text-gray-500">
      <FormField
        label="Model*"
        name="model"
        value={form.model}
        onChange={handleChange("model")}
        error={errors.model}
        disabled={isDisabled}
        required
      />

      <FormField
        label="Name*"
        name="name"
        value={form.name}
        onChange={handleChange("name")}
        error={errors.name}
        disabled={isDisabled}
        required
      />

      <FormField
        label="Serial number*"
        name="serialNo"
        value={form.serialNo}
        onChange={handleChange("serialNo")}
        error={errors.serialNo}
        disabled={isDisabled}
        className="uppercase"
        required
      />

      <FormField
        label="Office*"
        name="office"
        type="select"
        value={form.office}
        onChange={handleChange("office")}
        error={errors.office}
        disabled={isDisabled}
        options={officeOptions}
        placeholder="Select an office"
        required
      />

      <FormField
        label="Division"
        name="division"
        value={form.division}
        onChange={handleChange("division")}
        disabled={isDisabled}
      />

      <FormField
        label="RAM"
        name="ram"
        value={form.ram}
        onChange={handleChange("ram")}
        disabled={isDisabled}
      />

      <FormField
        label="Processor"
        name="processor"
        value={form.processor}
        onChange={handleChange("processor")}
        disabled={isDisabled}
      />

      <FormField
        label="Operating system"
        name="os"
        value={form.os}
        onChange={handleChange("os")}
        disabled={isDisabled}
      />
    </div>
  );
};

export default ComputerFormFields;