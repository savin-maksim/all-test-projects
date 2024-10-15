import React from 'react';
import Modal from '../Components/Modal';

export const InitialTutorialModal = ({ isOpen, onClose, handleQuestionMarkClick }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 style={{ textAlign: 'center' }}>Welcome to the Complex Calculator!</h2>
    <p>To learn how to use this calculator, click on the following button:</p>
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      <button
        style={{ padding: '0.5rem 3rem', fontSize: '1.2rem', background: 'var(--secondary-color)' }}
        onClick={() => {
          onClose();
          handleQuestionMarkClick();
        }}
      >
        Instructions
      </button>
    </div>
    <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'orangered' }}>
      Note: Clicking this button will close this window and open the instructions.
    </p>
    <p>
      For future reference, you can access the instructions again by following these steps:
      <p>Click on the buttons: <br/><button style={{ padding: '0.5rem 1rem', background: 'grey' }}>Functions</button> &rarr; <button style={{ padding: '0.5rem 3rem', background: 'gray' }}>Instructions</button> </p>
    </p>
  </Modal>
);