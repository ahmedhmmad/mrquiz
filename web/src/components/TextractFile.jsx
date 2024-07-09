import React, { useState } from 'react';
import axios from 'axios';

const TextractFile = ({ fileName }) => {
  const [result, setResult] = useState(null);

  const handleTextract = () => {
    axios.post('/textract', { fileName })
      .then(response => {
        setResult(response.data.textractData);
      })
      .catch(error => {
        console.error('There was an error processing the file with Textract!', error);
      });
  };

  return (
    <div>
      <button onClick={handleTextract}>Extract Text</button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default TextractFile;
