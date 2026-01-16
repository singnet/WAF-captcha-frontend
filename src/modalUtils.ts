export const ensureCaptchaContainer = (captchaContainerId: string, captchaContentId: string = 'captchaForm'): HTMLElement => {
  let container = document.getElementById(captchaContentId);
  const captchaContainer = document.getElementById(captchaContainerId) ?? document.body;

  if (!container) {
    container = document.createElement('div');
    container.id = captchaContentId;
    captchaContainer.appendChild(container);
  }
  
  return container;
};

export const ensureModalContainer = (captchaContainerId: string, overlayId = 'modalOverlay', modalId = 'modal') => {
  const captchaContainer = document.getElementById(captchaContainerId) ?? document.body;
  let overlay = document.getElementById(overlayId);
  let modal = document.getElementById(modalId);
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modalOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: none;
      z-index: 9999;
      align-items: center;
      justify-content: center;
    `;
    captchaContainer.appendChild(overlay);
  }
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
    `;
    overlay.appendChild(modal);
  }
  
  return { overlay, modal };
};

export const showCaptchaModal = (
  captchaContainerId: string,
  captchaContentId?: string,
  overlayId?: string,
  modalId?: string,
): void => {
  const { overlay, modal } = ensureModalContainer(captchaContainerId, overlayId, modalId);
  const captchaForm = ensureCaptchaContainer(captchaContainerId, captchaContentId);
  
  if (captchaForm.parentElement !== modal) {
    modal.appendChild(captchaForm);
  }
  
  overlay.style.display = 'flex';
};

export const hideCaptchaModal = (overlayId: string = 'modalOverlay'): void => {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.style.display = 'none';
  }
};