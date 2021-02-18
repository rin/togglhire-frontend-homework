import React from 'react';
import './styles.css';

export const NOTIFICATION_TYPES = {
  error: 'error',
  success: 'success',
};

const Notification = ({ type, text, handleClear }) => (
  <div class={`notification ${type}`}>
    <button className="dismiss" title="Dismiss" onClick={handleClear}>
      ⨯
    </button>
    {type === NOTIFICATION_TYPES.error && <h2>That didn't work 😬</h2>}
    {type === NOTIFICATION_TYPES.success && <h2>Yay 🥳</h2>}
    <p>{text}</p>
  </div>
);

export default Notification;
