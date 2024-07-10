import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Files from '../routes/Files';
import Textract from '../routes/Textract';
import Upload from '../routes/upload';

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
    setTextractResult(null); 
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Navigation</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/upload" className="text-blue-600 hover:underline">Upload File</Link>
            </li>
            <li className="mb-2">
              <Link to="/files" className="text-blue-600 hover:underline">Files List</Link>
            </li>
            <li className="mb-2">
              <Link to="/textract" className="text-blue-600 hover:underline">Textract File</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white p-4">
        <Routes>
          <Route path="/upload" element={<Upload onUpload={handleFileUpload} />} />
          <Route path="/files" element={<Files files={files} onFileSelect={handleFileSelect} />} />
          <Route path="/textract" element={<Textract selectedFile={selectedFile} onTextract={handleTextract} textractResult={textractResult} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;