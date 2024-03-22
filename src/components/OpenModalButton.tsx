import React from 'react';

interface OpenModalButtonProps {
  onClick: () => void;
}

const OpenModalButton: React.FC<OpenModalButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>Open Modal</button>
  );
};

export default OpenModalButton;
