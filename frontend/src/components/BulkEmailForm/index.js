import React, { useState, useRef } from 'react';
import { NOTIFICATION_TYPES } from '../Notification';
import { useNotification } from '../NotificationProvider';
import Loading from '../Loading';
import Dropzone from '../Dropzone';
import FileIcon from '../FileIcon';
import { sendEmails } from '../../services/emailApi';
import './styles.css';

const EMAIL_LIST_DELIMITER = '\n';

const BulkEmailForm = () => {
  const fileUpload = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [emails, setEmails] = useState([]);
  const { setNotification, clearNotification } = useNotification();
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

  const handleSelect = async (event) => handleUpload(event.target.files);

  const handleUpload = async (fileList) => {
    if (!fileList) return;

    // event.target.files is a FileList -> make it an array
    const filesArray = Array.from(fileList);
    setUploadedFiles(filesArray);
    clearNotification();

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
    setUploadedFiles([]);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    sendEmails(emails)
      .then(() => {
        setIsSubmitting(false);
        setNotification({
          message: `Successfully sent ${emails.length} emails.`,
        });
      })
      .catch((e) => {
        setError(e);
        setIsSubmitting(false);
      })
      .finally(resetForm());
  };

  return (
    <div className="bulkEmailForm">
      <form>
        {isSubmitting && <Loading />}
        <div className="content">
          <Dropzone onDrop={handleUpload}>
            {uploadedFiles.length > 0 ? (
              <>
                <ul className="uploadedFiles">
                  {uploadedFiles.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`}>
                      <FileIcon />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <label htmlFor="files">
                Drag and drop or click
                <br /> to select some email address files
              </label>
            )}
            <input
              ref={fileUpload}
              type="file"
              name="files"
              id="files"
              accept=".txt,text/plain"
              onChange={handleSelect}
              multiple
              hidden
            />
          </Dropzone>
          <p className="hint">
            These should be *.txt files with email addresses separated by new
            lines.
          </p>
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

export default BulkEmailForm;
