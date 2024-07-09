import React from 'react';
import TextractFile from '../components/TextractFile';

const Textract = ({ selectedFile, onTextract, textractResult }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Textract File</h2>
    {selectedFile ? (
      <TextractFile fileName={selectedFile} onTextract={onTextract} />
    ) : (
      <p>Please select a file to extract.</p>
    )}
    {textractResult && (
      <div className="my-4">
        <h3 className="text-xl font-bold">Textract Result:</h3>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(textractResult, null, 2)}</pre>
      </div>
    )}
  </div>
);

export default Textract;
