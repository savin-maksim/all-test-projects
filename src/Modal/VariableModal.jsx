import React from 'react';
import Modal from './Global/Modal';

export const VariableModal = ({ isOpen, onClose, onSave, variableName, setVariableName, currentValue }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    showSaveButton={true}
    onSave={onSave}
  >
    <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Create Variable</h2>
    <input
      value={variableName}
      onChange={(e) => setVariableName(e.target.value)}
      placeholder="Enter variable name"
      style={{
        width: '100%',
        height: '3rem',
        paddingRight: '1rem',
        textAlign: 'end',
        borderRadius: 'var(--button-border-radius)',
        border: '1px solid slategray',
        outline: 'none',
        fontSize: '1rem',
      }}
    />
    <p style={{ textAlign: 'center' }}>Current value: {currentValue}</p>
  </Modal>
);