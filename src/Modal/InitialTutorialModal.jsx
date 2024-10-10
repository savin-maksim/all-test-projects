import React from 'react';
import Modal from './Global/Modal';

export const InitialTutorialModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 style={{ textAlign: 'center' }}>Welcome to the Complex Calculator!</h2>
    <p>To learn how to use this calculator, first click on the - <button style={{ padding: '0.15rem 1rem', width: '10rem' }}>Functions</button>
    </p>
    <p>then click on the - <button style={{ padding: '0.15rem 1rem' }}>?</button></p>
  </Modal>
);