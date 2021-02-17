import React, { useState } from 'react';

const EmailListUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = (event) => {
    if (event.target.files) setUploadedFiles(event.target.files);
  };

  const handleSubmit = () => {
    // TODO
  };

  return (
    <div>
      <form>
        <label for="files">
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
        <button onClick={handleSubmit} disabled={!uploadedFiles.length}>
          Upload &amp; Send
        </button>
      </form>
    </div>
  );
};

export default EmailListUploader;
