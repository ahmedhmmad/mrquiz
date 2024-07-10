import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextractFile from './TextractFile';

const ListFiles = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    }

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('https://2e244dyrfj.execute-api.us-east-1.amazonaws.com/prod/listFiles');
                setFiles(response.data.files || []);
            } catch (error) {
                console.error('Failed to list files:', error);
            }
        };
        fetchFiles();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            <h1 className="text-3xl font-bold text-blue-600 mb-5">
                Files
            </h1>
            {files.length > 0 ? (
                <ul className="text-lg text-gray-700">
                    {files.map((file, index) => (
                        <li key={index} className='mb-2'>
                             <button 
                                onClick={() => handleFileSelect(file)}
                                className={`p-2 rounded ${selectedFile === file ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {file}
                            </button>
                            </li>
                    ))}
                </ul>
            ) : (
                <p>No files found.</p>
            )}
            {selectedFile && (
                 <div className="mt-5">
                 <h2 className="text-2xl font-bold mb-3">Selected File: {selectedFile}</h2>
                 <TextractFile fileName={selectedFile} />
             </div>
            )}
        </div>
    );
}

export default ListFiles;