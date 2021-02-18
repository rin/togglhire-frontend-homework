import React from 'react';
import BulkEmailForm from './components/BulkEmailForm';
import NotificationProvider from './components/NotificationProvider';

const App = () => (
  <div className="wrapper">
    <NotificationProvider>
      <h1>Invite Candidates</h1>
      <p>Let candidates know that they made it to the next round! 🎉</p>
      <BulkEmailForm />
    </NotificationProvider>
  </div>
);

export default App;
