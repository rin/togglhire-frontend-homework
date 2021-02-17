import React, { useState } from 'react';

const EmailListUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = (event) => {
    if (!event.target.files) return;

    // event.target.files is a FileList -> make it an array
    const fileList = event.target.files;
    let files = [];
    for (let i = 0; i < fileList.length; i++) files.push(fileList[i]);
    setUploadedFiles(files);
  };

  const handleSubmit = () => {
    // TODO
  };

  return (
    <div>
      <form>
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
        <button onClick={handleSubmit} disabled={!uploadedFiles.length}>
          Send Emails
        </button>
      </form>
    </div>
  );
};

export default EmailListUploader;
