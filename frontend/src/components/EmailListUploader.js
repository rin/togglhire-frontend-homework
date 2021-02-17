import React, { useState, useRef } from 'react';
import Notification, { NOTIFICATION_TYPES } from './Notification';
import './emailListUploader.css';

const EMAIL_LIST_DELIMITER = '\n';
const EMAIL_API_URL = 'https://toggl-hire-frontend-homework.vercel.app/api';

const API_ERRORS = {
  send_failure: 'Error sending email to the following addresses',
  invalid_email_address: 'The following email addresses are not valid',
  server_error: 'The server reported an error. Please try again.',
};

const EmailListUploader = () => {
  const fileUpload = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [emails, setEmails] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setError = (message) =>
    setNotification({ type: NOTIFICATION_TYPES.error, message });

  const parseEmailsFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        if (!file.type.match('text')) reject('Please provide a text file');
        const content = fileReader.result;
        const lines = content.trim().split(EMAIL_LIST_DELIMITER);
        resolve(lines);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(file);
    });
  };

  const handleUpload = async (event) => {
    if (!event.target.files) return;

    // event.target.files is a FileList -> make it an array
    const filesArray = Array.from(event.target.files);
    setUploadedFiles(filesArray);
    setNotification(null);

    Promise.all(filesArray.map(parseEmailsFromFile))
      .then((result) => {
        const emailList = result.flat();
        // using Set to de-duplicate emails
        setEmails([...new Set(emailList)]);
      })
      .catch((e) => setError(`Something went wrong: ${e}`));
  };

  const resetForm = () => {
    fileUpload.current.value = '';
    setEmails([]);
    setIsSubmitting(false);
    setUploadedFiles([]);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const body = JSON.stringify({ emails });
    fetch(`${EMAIL_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((response) => {
        if (response.ok) {
          setNotification({
            type: NOTIFICATION_TYPES.success,
            message: `Successfully sent ${emails.length} emails.`,
          });
          resetForm();
        } else {
          response.json().then(({ error, emails }) => {
            const errorMessage = API_ERRORS[error] || error;
            setError(`${errorMessage} ${(emails || []).join(', ')}`);
            resetForm();
          });
        }
      })
      .catch((error) => {
        console.log('Something went wrong: ', error);
        setError(error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="emailListUploader">
      <form>
        <div className="content">
          {notification && (
            <Notification
              type={notification.type}
              text={notification.message}
            />
          )}
          <label htmlFor="files">Select email address files</label>
          <input
            ref={fileUpload}
            type="file"
            name="files"
            id="files"
            accept=".txt,text/plain"
            onChange={handleUpload}
            multiple
          />
          <p className="hint">
            These should be *.txt files with email addresses separated by new
            lines.
          </p>
          {uploadedFiles.length > 0 && (
            <>
              <h3>Uploaded Files</h3>
              <ul>
                {uploadedFiles.map((file) => (
                  <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                ))}
              </ul>
            </>
          )}
          {emails.length > 0 && (
            <>
              <h3>Emails</h3>
              <ul className="emails">
                {emails.sort().map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="action">
          <button
            className="emailButton"
            onClick={handleSubmit}
            disabled={!uploadedFiles.length || isSubmitting}
          >
            Send {emails.length ? emails.length : ''} Emails
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailListUploader;
