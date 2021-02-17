import React, { useState, useRef } from 'react';

const EMAIL_LIST_DELIMITER = '\n';
const EMAIL_API_URL = 'https://toggl-hire-frontend-homework.vercel.app/api';

const API_ERRORS = {
  send_failure: 'Error sending email to the following addresses',
  invalid_email_address: 'The following email addresses are not valid',
};

const EmailListUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [emails, setEmails] = useState([]);
  const [hasError, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    Promise.all(filesArray.map(parseEmailsFromFile))
      .then((result) => {
        const emailList = result.flat();
        // using Set to de-duplicate emails
        setEmails([...new Set(emailList)]);
      })
      .catch((e) => {
        console.log(`Something went wrong: ${e}`);
        setError(e);
      });
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
          console.log('success!');
        } else {
          console.log('oh no!');
        }
      })
      .catch((error) => {
        console.log('Something went wrong: ', error);
        setError(error);
    setIsSubmitting(false);
      });
  };

  return (
    <div>
      <form>
        {hasError && <p>{hasError.message}</p>}
        <label htmlFor="files">
          Select .txt files containing your email addresses.
        </label>
        <input
          type="file"
          name="files"
          id="files"
          accept=".txt,text/plain"
          onChange={handleUpload}
          multiple
        />
        {uploadedFiles.length > 0 && (
          <>
            <h3>Selected Files</h3>
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
            <ul>
              {emails.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </>
        )}
        <button
          onClick={handleSubmit}
          disabled={!uploadedFiles.length || isSubmitting}
        >
          Send {emails.length ? emails.length : ''} Emails
        </button>
      </form>
    </div>
  );
};

export default EmailListUploader;
