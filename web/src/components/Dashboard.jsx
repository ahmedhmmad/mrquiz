import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileInput from './FileInput';
import ListFiles from './ListFiles';
import TextractFile from './TextractFile';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textractResult, setTextractResult] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/list-files');
        setFiles(response.data.files);
      } catch (error) {
        console.error('There was an error listing the files!', error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const response = await axios.get('/list-files');
      setFiles(response.data.files);
    } catch (error) {
      console.error('There was an error uploading the file!', error);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setTextractResult(null); // Reset the previous textract result when a new file is selected
  };

  const handleTextract = async (fileName) => {
    try {
      const response = await axios.post('/textract', { fileName });
      setTextractResult(response.data.textractData);
    } catch (error) {
      console.error('There was an error processing the file with Textract!', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <FileInput onUpload={handleFileUpload} />
      <ListFiles files={files} onFileSelect={handleFileSelect} />
      {selectedFile && (
        <div className="my-4">
          <TextractFile fileName={selectedFile} onTextract={handleTextract} />
        </div>
      )}
      {textractResult && (
        <div className="my-4">
          <h3 className="text-xl font-bold">Textract Result:</h3>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(textractResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;