"use client";
import React, { useEffect, useState } from 'react';
import { USDC_ABI, UsdcAddress } from '@/contracts/Usdc_ABI';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

export default function Mint() {
    const [transacting, setTransacting] = useState(false);
    const account = useAccount();
    const { data: hash, isPending, error, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (transacting) {
            // Invoke the writeContract function only when transacting changes
            writeContract({
                address: UsdcAddress,
                abi: USDC_ABI,
                functionName: 'mint'
            });
        }
    }, [transacting]); // Only re-run the effect if transacting changes
    useEffect(() => {
        if (isConfirmed) {
            // Set transacting to false after 2 seconds
            const timeout = setTimeout(() => {
                setTransacting(false);
            }, 1300);
    
            // Cleanup function to clear the timeout if the component unmounts or isConfirmed changes
            return () => clearTimeout(timeout);
        }
    }, [isConfirmed]);
    return (
        <>
            {transacting && (
                <div className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center backdrop-blur-[1px] bg-gray-900 bg-opacity-30 z-20">
                    <div className="bg-primary fixed absolute top-50 right-50 items-center text-center text-sm rounded-lg z-20 p-6 h-36 w-80">
                        {!isConfirmed && !error ? (
                            <span className="loading loading-color loading-ring text-success mb-4 loading-lg"></span>
                        ) : !error ? (
                            <div className="flex mb-2 items-center justify-center">
                                <div
                                    className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center"
                                    style={{
                                        animation: `scaleOpacityAnimation 0.4s ease-out forwards`,
                                        transformOrigin: 'center',
                                        transform: 'scale(0)', // Start with 0 scale
                                        opacity: 0, // Start with 0 opacity
                                    }}
                                >
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="flex mb-2 items-center justify-center">
                                <div
                                    className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center"
                                    style={{
                                        animation: `scaleOpacityAnimation 0.7s ease-out forwards`,
                                        transformOrigin: 'center',
                                        transform: 'scale(0)', // Start with 0 scale
                                        opacity: 0, // Start with 0 opacity
                                    }}
                                >
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        {transacting && !isConfirming && !error && !isConfirmed && (
                            <div>Waiting for user confirmation . . .</div>
                        )}
                        {isConfirming && !error && (
                            <div>Minting 1k usdc...</div>
                        )}
                        {isConfirmed && <div>Transaction confirmed.</div>}
                        {hash && (
                            <div className='mt-2'>
                                <a
                                    className='bg-slate-200 border border-slate-400 p-0.5 px-1 rounded-md inline-block'
                                    href={`https://testnet.snowtrace.io/tx/${hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on Explorer
                                </a>
                            </div>
                        )}
                        {error && (
                            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                        )}
                    </div>
                </div>
            )}
            <button className='text-white mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none shadow-lg shadow-blue-500/50 dark:shadow-lg  font-medium rounded-lg text-sm px-3 py-1 text-center  ' onClick={() => setTransacting(true)}>Mint Usdc</button>
        </>
    );
}
