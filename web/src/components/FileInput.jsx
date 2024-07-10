import React, { useState } from "react";

const FileInput = () => {
    const [file, setFile] = useState(null);
    const [message,setMessage]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
   


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
       
    };

    const handleFileSubmit = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }
        
        setIsLoading(true);


        const reader = new FileReader();

        // Define the onload callback
        reader.onload = async () => {
            try {
                const fileContent = reader.result.split(',')[1]; 
                const fileName = file.name;
                console.log(fileName);

                const response = await fetch('https://2e244dyrfj.execute-api.us-east-1.amazonaws.com/prod/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fileContent, fileName }),
                });

                if (!response.ok) {
                    throw new Error('Error processing file');
                }

                const data = await response.json();
                console.log(data);
                setMessage(data.message);
                setFile(null);
            } catch (error) {
                console.error(error);
                alert('Failed to upload file. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        // Start reading the file
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            <h1 className="text-3xl font-bold text-blue-600 mb-5">
                Please Upload Your File
            </h1>
            <label className="block text-lg font-medium text-gray-700 mb-2">
                Upload File
            </label>
            <input 
                type="file" 
                className="file-input mb-5 w-64 p-2 border border-gray-300 rounded-md shadow-sm"
                onChange={handleFileChange}  disabled={isLoading}
            />
            <button 
                className={`bg-blue-500 text-white py-2 px-4 rounded transition duration-300 flex items-center ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                onClick={handleFileSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                    </>
                ) : (
                    'Submit'
                )}
            </button>
            {message && (
                <div className={`mt-5 p-3 rounded ${
                    message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileInput;
