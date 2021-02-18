import React from 'react';
import './styles.css';

const Dropzone = ({ onDrop, children }) => {
  const handleDrop = (event) => {
    event.preventDefault();
    onDrop(event.dataTransfer.files);
  };

  return (
    <div
      className="dropzone"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
};

export default Dropzone;
