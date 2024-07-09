import React from 'react';
import FileInput from '../components/FileInput';

const Upload = ({ onUpload }) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>
      <FileInput onUpload={onUpload} />
    </div>
  );

  export default Upload;
