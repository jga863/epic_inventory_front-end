import React from 'react';
import FormField from '../../../shared/components/forms/FormField';

const ComputerFormFields = ({ form, errors, handleChange, isSubmitting, officeOptions }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="Model"
        name="model"
        value={form.model}
        onChange={handleChange("model")}
        error={errors.model}
        disabled={isSubmitting}
        required
      />

      <FormField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange("name")}
        error={errors.name}
        disabled={isSubmitting}
        required
      />

      <FormField
        label="Serial number"
        name="serialNo"
        value={form.serialNo}
        onChange={handleChange("serialNo")}
        error={errors.serialNo}
        disabled={isSubmitting}
        className="uppercase"
        required
      />

      <FormField
        label="Office"
        name="office"
        type="select"
        value={form.office}
        onChange={handleChange("office")}
        error={errors.office}
        disabled={isSubmitting}
        options={officeOptions}
        placeholder="Select an office"
        required
      />

      <FormField
        label="Division"
        name="division"
        value={form.division}
        onChange={handleChange("division")}
        disabled={isSubmitting}
      />

      <FormField
        label="RAM"
        name="ram"
        value={form.ram}
        onChange={handleChange("ram")}
        disabled={isSubmitting}
      />

      <FormField
        label="Processor"
        name="processor"
        value={form.processor}
        onChange={handleChange("processor")}
        disabled={isSubmitting}
      />

      <FormField
        label="Operating system"
        name="os"
        value={form.os}
        onChange={handleChange("os")}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default ComputerFormFields;