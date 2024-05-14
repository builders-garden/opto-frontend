import React, { useRef, useState } from 'react';
import custom from "@/assets/icons/assetlogos/custom.png";
import Prism from 'prismjs';
import CodeEditor from '@uiw/react-textarea-code-editor';

const WriteCustomForm = ({ onClose }) => {
    const [code, setCode] = useState(
        `Write your Function() script here`
    );
    const handleSubmit = (event) => {
        // Handle form submission logic
    };
    
    return (
        <div className='items-center w-full'>

            <div id="crud-modal" aria-hidden="true" className="fixed inset-0 w-full z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white w-8/12 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                        <img className="w-10 ml-4 h-10 rounded-full opacity-100" src={custom.src} />
                        <h1 className='text-2xl'>Custom</h1>
                        <button type="button" className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2" onClick={onClose}>
                            <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className='mt-4 ml-4 w-11/12 text-xs rounded-r-full bg-primary flex items-center'>
                        <div className="flex items-center">

                        </div>

                        <span className='text-right w-full ml-auto mr-4'>  Call/Put</span><span className="ml-auto mt-1 text-center" ><input type="checkbox" className="toggle toggle-xs" /></span>
                    </div>
                    <form className="p-4 flex flex-col md:flex-row md:items-start md:gap-4" onSubmit={handleSubmit}>
                        <div className="w-30"> {/* Left Column - 30% width on medium screens and above */}
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Name
                                <input type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Description
                                <input type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="text-xs mt-2 input p-3 input-bordered flex items-center gap-3">
                                Strike
                                <input type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Premium cost
                                <input type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Units
                                <input type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Cap per unit
                                <input type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Expiration Date
                                <input type="date" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Buy-in deadline
                                <input type="date" className="grow p-3 text-right" required />
                            </label>
                        </div>
                        <div className="w-full md:w-70"> {/* Right Column - 70% width on medium screens and above */}
                     
    <CodeEditor
        value={code}
        minHeight={420}
        language="js"
        placeholder="Write your Function() script"
        onChange={(evn) => setCode(evn.target.value)}
        padding={10}
        className='block h-full p-2.5 w-full mt-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        style={{
            backgroundColor: "#f5f5f5", maxHeight: '420px', overflowY: 'auto',
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
    />


                  
                        </div>
                    </form>
                
                    <div className="flex items-center justify-end">
                        <span className="text-blue-500 mb-4 mr-4 ">Lock 93892 USDC</span>
                        <button type="submit" className="text-white relative mb-4 mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center">Confirm</button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default WriteCustomForm;