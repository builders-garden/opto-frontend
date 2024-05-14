import React from 'react';

const WriteOptionForm = ({ url: writingUrl, name: name, onClose }) => {
    // Handle form submission and other logic here
    const handleSubmit = (event) => {
        // Handle form submission logic
    };

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
                    <div className='mt-4 ml-4 w-11/12 text-xs rounded-r-full bg-primary flex items-center'>
                        <div className="flex items-center">

                        </div>
                        <div className="flex items-center">
                            <span className="ml-4">Current price: <br /> 1340$ </span>
                        </div>
                        <span className='text-right w-60'>  Call/Put</span><span className="ml-auto text-center" ><input type="checkbox" className="toggle toggle-xs" /></span>
                    </div>
                    <form className="p-4" onSubmit={handleSubmit}>

                        <label className="input p-3 input-bordered flex items-center gap-3">
                            Strike
                            <input type="text" className="focus:outline-none grow p-3 text-right " required />
                        </label>
                        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                            Premium cost
                            <input type="text" className="focus:outline-none grow p-3 text-right " required />
                        </label>
                        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                            Units
                            <input type="text" className="focus:outline-none grow p-3 text-right" required />
                        </label>
                        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                            Cap per unit
                            <input type="text" className="focus:outline-none grow p-3 text-right " required />
                        </label>
                        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                            Expiration Date
                            <input type="date" className="focus:outline-none grow p-3 text-right" required />
                        </label>
                        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                            Buy-in deadline
                            <input type="date" className="focus:outline-none grow p-3 text-right" required />
                        </label>

                    </form>
                    <div className="flex items-center justify-end">
                        <span className="text-blue-500 mb-4 mr-4 ">Lock 93892 USDC</span>
                        <button type="submit" className="text-white relative mb-4 mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriteOptionForm;