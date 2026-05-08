import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppButton from "../components/AppButton";
import ImageUpload from "./images/ImageUpload";
import { renderFormField } from "./renderers/fieldRenderers";

/**
 * Composes a zod schema from the `validation` of each field. Fields without explicit
 * validation become optional strings/numbers/dates so the UI never blocks on them.
 */
function buildSchema(fields) {
  const shape = {};
  fields.forEach((field) => {
    if (field.name === "image" || field.type === "custom" || !field.name) return; // image/custom are handled separately
    if (field.validation) {
      shape[field.name] = field.validation;
    } else if (field.type === "number") {
      shape[field.name] = z.union([z.string(), z.number()]).optional().nullable();
    } else if (field.type === "boolean") {
      shape[field.name] = z.boolean().optional();
    } else {
      shape[field.name] = z.string().optional().nullable();
    }
  });
  return z.object(shape);
}

function buildDefaultValues(fields, initialValues) {
  const defaults = {};
  fields.forEach((field) => {
    if (field.name === "image" || field.type === "custom" || !field.name) return;
    const seed = initialValues?.[field.name];
    if (field.type === "number") {
      defaults[field.name] = seed != null ? String(seed) : "";
    } else if (field.type === "boolean") {
      defaults[field.name] = Boolean(seed);
    } else {
      defaults[field.name] = seed != null ? String(seed) : "";
    }
  });
  return defaults;
}

function isFieldVisible(field, values, context) {
  if (typeof field.visibleWhen !== "function") {
    return field.hidden ? false : true;
  }
  return Boolean(field.visibleWhen(values, context));
}

/**
 * Schema-driven form. Renders fields via fieldRenderers and validates with zod.
 *
 * Props:
 *  - config: full asset config (for entityKey, formFields)
 *  - mode: 'create' | 'edit'
 *  - initialValues: record being edited (or null)
 *  - dynamicOptions: { [fieldName]: [{value,label}] } for asyncSelect
 *  - onSubmit(values, { imageFile }) called when valid
 *  - submitting: disables actions while parent runs the mutation
 */
function AssetForm({
  config,
  mode,
  initialValues,
  dynamicOptions,
  permissions,
  onSubmit,
  onCancel,
  submitting = false,
  serverError,
}) {
  const fields = useMemo(() => config.formFields || [], [config.formFields]);
  const hasImageField = fields.some((f) => f.name === "image");
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const defaults = useMemo(() => buildDefaultValues(fields, initialValues), [fields, initialValues]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });
  const values = useWatch({ control });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    reset(defaults);
    setImageFile(null);
  }, [defaults, reset]);

  const visibilityContext = useMemo(
    () => ({ mode, initialValues, permissions }),
    [initialValues, mode, permissions]
  );
  const visibleFields = useMemo(
    () => fields.filter((field) => field.name !== "image" && isFieldVisible(field, values, visibilityContext)),
    [fields, values, visibilityContext]
  );

  const submitLabel = mode === "edit"
    ? `Save changes`
    : `Create ${config.labels?.singular?.toLowerCase() || "record"}`;

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => onSubmit(values, { imageFile }))}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.map((field) => (
            <div key={field.name} className={field.span === "full" ? "md:col-span-2" : ""}>
              {field.type === "custom" && typeof field.renderField === "function"
                ? field.renderField({ field, control, errors, dynamicOptions, values, permissions, mode })
                : renderFormField({ field, control, errors, dynamicOptions })}
            </div>
          ))}
        {hasImageField ? (
          <div className="md:col-span-2">
            <p className="app-field-label mb-2">Photo</p>
            <ImageUpload
              entityKey={config.entityKey}
              itemId={mode === "edit" ? initialValues?.id : null}
              version={initialValues?.updatedAt}
              onFileSelected={setImageFile}
              onUploaded={() => {/* parent will refetch via invalidate */}}
            />
          </div>
        ) : null}
      </div>

      {serverError ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--color-danger)",
            background: "var(--color-danger-soft)",
            color: "var(--color-danger)",
          }}
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <AppButton type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </AppButton>
        <AppButton type="submit" loading={submitting}>{submitLabel}</AppButton>
      </div>
    </form>
  );
}

export default AssetForm;
