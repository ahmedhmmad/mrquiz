import React, { useState } from 'react';
import axios from 'axios';

const TextractFile = ({ fileName }) => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTextract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://2e244dyrfj.execute-api.us-east-1.amazonaws.com/prod/textRact', { fileName });
      setResult(response.data.extractedText);
    } catch (error) {
      console.error('There was an error processing the file with Textract!', error);
      setError('Failed to extract text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <button 
        onClick={handleTextract}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? 'Extracting...' : 'Extract Text'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-5">
          <h3 className="text-xl font-bold mb-2">Extracted Text:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TextractFile;