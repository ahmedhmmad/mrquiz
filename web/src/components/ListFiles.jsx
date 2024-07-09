import React, {useState,useEffect} from 'react';
import axios from 'axios';

const ListFiles=()=>{
    const [files,setFiles]=useState([]);

    // useEffect(()=>{
    //     const fetchFiles=async()=>{
    //         try{
    //             const response=await axios.get('https://2e244dyrfj.execute-api.us-east-1.amazonaws.com/prod/');
    //             setFiles(response.data.files);
    //         }catch(error){
    //             console.error('Failed to list files:',error);
    //         }
    //     };
    //     fetchFiles();
    // },[]);

    useEffect(()=>{
        const fetchFiles=async()=>{
            try{
                const response=await axios.get('/list-files');
                setFiles(response.data.files);
            }catch(error){
                console.error('Failed to list files:',error);
            }
        };
        fetchFiles();
    },[]);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
            <h1 className="text-3xl font-bold text-blue-600 mb-5">
                Files
            </h1>
            <ul className="text-lg text-gray-700">
                {files.map((file,index)=>(
                    <li key={index}>{file}</li>
                ))}
            </ul>
        </div>
    );
}

export default ListFiles;