import React from 'react';
import Modal from '../Components/Modal';
import { Info, SquareFunction } from 'lucide-react';

export const InitialTutorialModal = ({ isOpen, onClose, handleQuestionMarkClick }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 style={{ textAlign: 'center' }}>Welcome to the Complex Calculator!</h2>
    <p>To learn how to use this calculator, click on the following button:</p>
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      <button
        style={{ display: 'flex', padding: '0.5rem 3rem', background: 'var(--secondary-color)' }}
        onClick={() => {
          onClose();
          handleQuestionMarkClick();
        }}
      >
        <Info />
      </button>
    </div>
    <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'orangered' }}>
      <p>
        Note: Clicking this button will close this window and open the instructions.
      </p>
    </div>
  </Modal>
);