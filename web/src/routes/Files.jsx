import React from 'react';
import ListFiles from '../components/ListFiles';

const Files = ({ files, onFileSelect }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Files List</h2>
    <ListFiles files={files} onFileSelect={onFileSelect} />
  </div>
);

export default Files;