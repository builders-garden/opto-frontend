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
import { polygonAmoy } from 'wagmi/chains'

function BuyBtn({ optionId, maxunits, premium }) {
    const [transacting, setTransacting] = useState(false);
    const [step, setStep] = useState(0);
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


     const { data: allowance } = useReadContract({
        abi: USDC_ABI,
        address: UsdcAddress,
        functionName: "allowance",
        args: [
            account.address as `0x${string}`, 
            OptoAddress  as `0x${string}`
        ],
        chainId: polygonAmoy.id
    })


    const submit = async (e) => {
        e.preventDefault(); // Preve
        try {
            writeContract({
                address: UsdcAddress,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [OptoAddress, BigInt(units) * BigInt(premium)], // Convert units to BigInt
            });
            setTransacting(true)
            setStep(1)
        } catch (err) {
            console.error(err); // Log any errors
        };
        

    }
   


    useEffect(() => {
       
        if (isConfirmed && step === 1) {
            const timeout = setTimeout(() => {
                setStep(2);
                
                try {
                    writeContract({
                        address: OptoAddress,
                        abi: OptoAbi,
                        functionName: 'buyOption',
                        args: [BigInt(optionId), BigInt(units)], // Convert units to BigInt
                    });
                    setStep(2);
                } catch (err) {
                    console.error(err); // Log any errors
                }
            }, 3000);

            return () => clearTimeout(timeout);
        }
        if (isConfirmed && step === 2) {
            const timeout = setTimeout(() => {
                setTransacting(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
      
    }, [isConfirmed]);

        useEffect(()=>{
            if (error){
         
            const timeout = setTimeout(() => {
             try {
                 setTransacting(false);
             } catch (err) {
                 console.error(err); // Log any errors
             }
         }, 3000);
            return () => clearTimeout(timeout);
     }
         }, [error])

    return (
<> {transacting && ( <div className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center backdrop-blur-[1px] bg-gray-900 bg-opacity-30 z-20">
            <div className="bg-primary fixed absolute top-50 right-50 items-center  text-center text-sm rounded-lg z-20 p-6 h-36 w-80">

                {!isConfirmed && !error ? (
                    <span className="loading loading-color loading-ring text-success mb-4 loading-lg"></span>
                ) : !error ? (
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
                ) : (<> <div className="flex mb-2 items-center justify-center">
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

        <form style={{ position: 'relative'  }} onSubmit={submit}>
            <label className="form-control w-full mr-4  max-w-xs">
                <input
                    type="number"
                    className='input input-xs input-bordered z-2 mr-4 w-xs max-w-xs'
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="Enter units"
                    required
                    max={maxunits}
                    min={1}
                />
                <button type="submit" disabled={isPending} className='text-white mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center absolute right-0 top-0'>
                    Buy
                </button>
          
            </label>
        </form></>
    );
}

export default BuyBtn;
