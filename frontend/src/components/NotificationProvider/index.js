import React, { useContext, createContext } from 'react';
import Notification, { NOTIFICATION_TYPES } from '../Notification';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notification, _setNotification] = React.useState(null);

  const setNotification = ({ message, type = NOTIFICATION_TYPES.success }) =>
    _setNotification({ message, type });

  const clearNotification = () => _setNotification(null);

  return (
    <NotificationContext.Provider
      value={{ setNotification, clearNotification }}
    >
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          handleClear={clearNotification}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
export default NotificationProvider;
