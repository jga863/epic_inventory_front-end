import ResourceModal from "../components/ResourceModal";
import AppButton from "../components/AppButton";

function ConfirmDeleteModal({ open, target, label = "record", onConfirm, onClose, busy = false }) {
  return (
    <ResourceModal open={open} title={`Delete ${label}`} onClose={onClose} width="max-w-lg">
      {target ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Delete{" "}
            <span className="font-semibold text-[var(--color-text)]">
              {target.label || `#${target.id}`}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <AppButton type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </AppButton>
            <AppButton type="button" variant="danger" onClick={onConfirm} loading={busy}>
              Delete
            </AppButton>
          </div>
        </div>
      ) : null}
    </ResourceModal>
  );
}

export default ConfirmDeleteModal;
