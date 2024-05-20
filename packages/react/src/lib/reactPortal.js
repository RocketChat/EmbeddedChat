import { createPortal } from 'react-dom';

function ReactPortal({ children, wrapperId }) {
  const portalContainer = document.getElementById(wrapperId);

  if (!portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
}

export default ReactPortal;
