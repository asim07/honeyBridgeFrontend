import React, { ReactNode } from 'react';
import './modal.css'
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Add this line to define children prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{backgroundColor:"#020412"}}>
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
