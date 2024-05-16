import React, { useState, useEffect } from 'react';
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount
} from 'wagmi'
import { OptoAddress, OptoAbi } from '@/contracts/Opto_ABI';
import { USDC_ABI, UsdcAddress } from '@/contracts/Usdc_ABI'
import { useReadContract } from 'wagmi';

function ClaimBtn({ optionId }) {
    const [step, setStep] = useState(0);
    const [transacting, setTransacting] = useState(false);
    const account = useAccount();
    const {
        data: hash,
        isPending,
        error,
        writeContract
    } = useWriteContract();

    // Check if transaction is pending or confirmed
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });
    const [units, setUnits] = useState(""); // State to hold the input value


    const submit = async (e) => {
        e.preventDefault(); // Preve
        setTransacting(true);
        try {
            writeContract({
                address: OptoAddress,
                abi: OptoAbi,
                functionName: 'claimOption',
                args: [BigInt(optionId)], // Convert units to BigInt
            });

        } catch (err) {
            console.error(err); // Log any errors
        }
    }

    useEffect(() => {
        if (isConfirmed || error) {
          const timeout = setTimeout(() => {
            setTransacting(false);
          }, 3000);
    
          return () => clearTimeout(timeout);
        }
      }, [isConfirmed, error]);



    return (
        <>
             {transacting && (<div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-[1px] bg-gray-900 bg-opacity-30 z-10">
        <div className="bg-primary rounded-lg p-6 h-36 w-80">

            {!isConfirmed && !error ? (
                <span className="loading loading-color loading-ring text-success mb-4 loading-lg"></span>
            ) : !error ?(
                <> <div className="flex mb-2 items-center justify-center">
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
                    <style>{`
                            @keyframes scaleOpacityAnimation {
                            0% {
                                transform: scale(0);
                                opacity: 0;
                            }
                            65% {
                                opacity: 0.5;
                            }
                            100% {
                                transform: scale(0.6);
                                opacity: 1;
                            }
                            }
                        `}
                        </style>
                </div></>
            ): ( <> <div className="flex mb-2 items-center justify-center">
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
            <style>{`
                    @keyframes scaleOpacityAnimation {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    65% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(0.6);
                        opacity: 1;
                    }
                    }
                `}
                </style>
        </div></>)}
            
            {transacting && !isConfirming && !error && !isConfirmed && (<><div>Waiting for user confirmation . . .</div></>)}
            {isConfirming && !error && (<><div>Waiting for confirmation...</div></>)}

            {isConfirmed && <div>Transaction confirmed.</div>}
            {hash && <div className='mt-2'><a
                className='bg-slate-200 border border-slate-400 p-0.5 px-1 rounded-md inline-block'
                href={`https://testnet.snowtrace.io/tx/${hash}`}
                target="_blank" rel="noopener noreferrer"
            > View on Explorer</a>
            </div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </div>

    </div>
    )}
            <form style={{ position: 'relative' }} onSubmit={submit}>

                <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">
                    Claim
            
                </button>




            </form>
        </>
    );
}

export default ClaimBtn;
