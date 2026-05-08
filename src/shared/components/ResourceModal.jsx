import AppModal from "./AppModal";

function ResourceModal({ title, children, onClose, width = "max-w-3xl", subtitle, open = true }) {
  return (
    <AppModal open={open} title={title} subtitle={subtitle} onClose={onClose} width={width}>
      {children}
    </AppModal>
  );
}

export default ResourceModal;
