import ResourceModal from "../components/ResourceModal";
import AssetForm from "./AssetForm";

function AssetFormModal({ open, mode, config, initialValues, dynamicOptions, permissions, onClose, onSubmit, submitting, serverError }) {
  const title = mode === "edit"
    ? `Update ${config.labels?.singular?.toLowerCase() || "record"}`
    : `Create ${config.labels?.singular?.toLowerCase() || "record"}`;

  return (
    <ResourceModal
      open={open}
      title={title}
      subtitle="Fill in the details and save when you are ready."
      onClose={onClose}
      width="max-w-4xl"
    >
      {open ? (
        <AssetForm
          config={config}
          mode={mode}
          initialValues={initialValues}
          dynamicOptions={dynamicOptions}
          permissions={permissions}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitting={submitting}
          serverError={serverError}
        />
      ) : null}
    </ResourceModal>
  );
}

export default AssetFormModal;
