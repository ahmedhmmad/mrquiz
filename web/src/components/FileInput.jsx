import React from "react";

const FileInput = (props) => {
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
                onChange={props.onChange} 
            />
            <button 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                onClick={props.onSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default FileInput;
