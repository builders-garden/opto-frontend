import React from 'react';
import CreateOption from './CreateOption'
const WriteOptionForm = ({ url: writingUrl, name: name, onClose }) => {
    

    return (
        <div className='items-center'>

            <div id="crud-modal" aria-hidden="true" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                        <img className="w-10 ml-4 h-10 rounded-full opacity-100" src={writingUrl} />
                        <h1 className='text-2xl'>{name}</h1>
                        <button type="button" className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2" onClick={onClose}>
                            <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                  <CreateOption/>
                
                </div>
            </div>
        </div>
    );
};

export default WriteOptionForm;