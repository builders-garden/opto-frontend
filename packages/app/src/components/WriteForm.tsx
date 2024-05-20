import React from 'react';
import CreateOption from './CreateOption';

const WriteOptionForm = ({ url: writingUrl, name, onClose }) => {
    // Define the asset mapping
    const assetMapping = {
        gold: { assetId: 9, type: 0, queryId: 0, address: "0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c" },
        silver: { assetId: 8, type: 0, queryId: 0, address: "0xC56765f04B248394CF1619D20dB8082Edbfa75b1" },
        amazon: { assetId: 2, type: 0, queryId: 0, address: "0xd6a77691f071E98Df7217BED98f38ae6d2313EBA" },
        apple: { assetId: 1, type: 0, queryId: 0, address: "0x8d0CC5f38f9E802475f2CFf4F9fc7000C2E1557c" },
        coinbase: { assetId: 3, type: 0, queryId: 0, address: "0x950DC95D4E537A14283059bADC2734977C454498" },
        google: { assetId: 4, type: 0, queryId: 0, address: "0x1D1a83331e9D255EB1Aaf75026B60dFD00A252ba" },
        microsoft: { assetId: 5, type: 0, queryId: 0, address: "0xDde33fb9F21739602806580bdd73BAd831DcA867" },
        nvidia: { assetId: 6, type: 0, queryId: 0, address: "0x4881A4418b5F2460B21d6F08CD5aA0678a7f262F" },
        tesla: { assetId: 7, type: 0, queryId: 0, address: "0x3609baAa0a9b1f0FE4d6CC01884585d0e191C3E3" },
        gaseth: { assetId: 0, type: 1, queryId: 1, address: "https://api.studio.thegraph.com/query/73482/opto-basefees-ethereum/version/latest" },
        gasavax: { assetId: 0, type: 1, queryId: 2, address: "https://api.studio.thegraph.com/query/73482/opto-basefees-avax/version/latest" },
        gasbnb: { assetId: 0, type: 1, queryId: 2, address: "https://api.studio.thegraph.com/query/73482/opto-basefees-avax/version/latest" },
        blobeth: { assetId: 0, type: 1, queryId: 3, address: "https://api.studio.thegraph.com/query/73482/opto-basefees-ethereum/version/latest" }
    };
    
    // Get the asset details based on the name prop (in lowercase)
    const assetDetails = assetMapping[name.toLowerCase()] || { assetId: null, type: 0, queryId: 0, address: '' };

    return (
        
        <div className='items-center'>
            <div id="crud-modal" aria-hidden="true" className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                        <img className=" ml-4 h-10 rounded-full opacity-100" src={writingUrl} alt={name} />
                        <h1 className='text-2xl'>{name}</h1>
                        <button type="button" className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2" onClick={onClose}>
                            <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <CreateOption assetId={assetDetails.assetId} queryId={assetDetails.queryId} type={assetDetails.type} feedAddress={assetDetails.address} />
                </div>
            </div>
        </div>
    );
};

export default WriteOptionForm;
