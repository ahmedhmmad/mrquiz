import React, { useState } from "react";

const FileInput = () => {
    const [file, setFile] = useState(null);
    const [message,setMessage]=useState(null);
   


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
       
    };

    const handleFileSubmit = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

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
                onChange={handleFileChange} 
            />
            <button 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                onClick={handleFileSubmit}
            >
                Submit
            </button>
            {message && (
                <div className="mt-5 p-3 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileInput;
