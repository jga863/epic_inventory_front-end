import React from 'react';
import FormField from '../../../shared/components/forms/FormField';

const EmployeeFormFields = ({
  form,
  errors,
  handleChange,
  isDisabled,
  officeOptions,
  statusOptions
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        label="First name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange("firstName")}
        error={errors.firstName}
        disabled={isDisabled}
        required
      />

      <FormField
        label="Last name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange("lastName")}
        error={errors.lastName}
        disabled={isDisabled}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        error={errors.email}
        disabled={isDisabled}
        required
      />

      <FormField
        label="Office"
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
        label="Department"
        name="department"
        value={form.department}
        onChange={handleChange("department")}
        error={errors.department}
        disabled={isDisabled}
        required
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        value={form.status}
        onChange={handleChange("status")}
        disabled={isDisabled}
        options={statusOptions}
      />

      <FormField
        label="Extension"
        name="extension"
        value={form.extension}
        onChange={handleChange("extension")}
        error={errors.extension}
        disabled={isDisabled}
      />

      <FormField
        label="Phone"
        name="cellPhone"
        value={form.cellPhone}
        onChange={handleChange("cellPhone")}
        error={errors.cellPhone}
        disabled={isDisabled}
      />
    </div>
  );
};

export default EmployeeFormFields;