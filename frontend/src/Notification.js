import React from 'react';

export const NOTIFICATION_TYPES = {
  error: 'error',
  success: 'success',
};

const Notification = ({ type, text }) => (
  <div>
    {type === NOTIFICATION_TYPES.error && <h2>Error</h2>}
    {type === NOTIFICATION_TYPES.success && <h2>Yay</h2>}
    <p>{text}</p>
  </div>
);

export default Notification;
