import React, { useState, useEffect } from 'react';
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount,
    useReadContract 
} from 'wagmi';
import { OptoAddress, OptoAbi } from '@/contracts/Opto_ABI';
import { USDC_ABI, UsdcAddress } from '@/contracts/Usdc_ABI';
import{polygonAmoy} from  'wagmi/chains';
function CreateOption({ type, queryId, assetId }) {
    const [transacting, setTransacting] = useState(false);
    const account = useAccount();
    const [allowance, setAllowance] = useState('');
    const [strike, setStrike] = useState('');
    const [premium, setPremium] = useState('');
    const [units, setUnits] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [isCall, setIsCall] = useState(false); 
    const [capPerUnit, setCapPerUnit] = useState('');

    const [step, setStep] = useState(0);
    const {
        data: hash,
        isPending,
        error,
        writeContract
    } = useWriteContract();


    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });


        // const {  result } = useReadContract({
        //     abi: USDC_ABI,
        //     address: UsdcAddress,
        //     functionName: "allowance",
        //     args: [
        //       account as `0x${string}`,
        //       OptoAddress
        //     ],
        //     chain: polygonAmoy.id
        //   });
        //   useEffect(()=>{
        //     console.log("fuck", result)
        
        //   },[])
          
          
    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const strike = formData.get('strike');
        const premium = formData.get('premium');
        const units = formData.get('units');
        const expirationDate = formData.get('expirationDate');
        const deadlineDate = formData.get('deadlineDate');
        const capPerUnit = formData.get('capPerUnit');
        const unixDead = BigInt(Math.floor(new Date(deadlineDate).getTime() / 1000));
        const unixExp = BigInt(Math.floor(new Date(expirationDate).getTime() / 1000));
        const isCallValue = formData.get('isCall') === 'on'; // Checkbox returns 'on' if checked

        setIsCall(!isCallValue);
        setStrike(strike);
        setPremium(premium);
        setUnits(units);
        setExpirationDate(unixExp);
        setDeadlineDate(unixDead);
        setCapPerUnit(capPerUnit);
        setStep(1);
        setTransacting(true);
        
        try {
            await writeContract({
                address: UsdcAddress,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [OptoAddress, BigInt(units) * BigInt(capPerUnit)],
            });
        } catch (err) {
            console.error(err); // Log any errors
        }
    };

    useEffect(() => {
        if (isConfirmed && step === 1) {
            const timeout = setTimeout(() => {
                setStep(2);
                console.log("coddiaccio");
                try {
                    writeContract({
                        address: OptoAddress,
                        abi: OptoAbi,
                        functionName: 'createOption',
                        args: [
                            isCall,
                            BigInt(premium),
                            BigInt(strike),
                            BigInt(deadlineDate),
                            BigInt(expirationDate),
                            type,
                            BigInt(queryId),
                            BigInt(assetId),
                            BigInt(units),
                            BigInt(capPerUnit)
                        ],
                    });
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
    }, [isConfirmed, step, isCall, premium, strike, deadlineDate, expirationDate, type, queryId, assetId, units, capPerUnit]);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setTransacting(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    return (
        <>
            {transacting && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-[1px] bg-gray-900 bg-opacity-30 z-10">
                    <div className="bg-primary items-center text-center text-sm rounded-lg p-6 h-36 w-80">
                        {!isConfirmed && !error ? (
                            <span className="loading loading-color loading-ring text-success mb-4 loading-lg"></span>
                        ) : !error ? (
                            <div className="flex mb-2 items-center justify-center">
                                <div
                                    className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center"
                                    style={{
                                        animation: `scaleOpacityAnimation 0.4s ease-out forwards`,
                                        transformOrigin: 'center',
                                        transform: 'scale(0)',
                                        opacity: 0,
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
                                `}</style>
                            </div>
                        ) : (
                            <div className="flex mb-2 items-center justify-center">
                                <div
                                    className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center"
                                    style={{
                                        animation: `scaleOpacityAnimation 0.7s ease-out forwards`,
                                        transformOrigin: 'center',
                                        transform: 'scale(0)',
                                        opacity: 0,
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
                                `}</style>
                            </div>
                        )}

                        {transacting && !isConfirming && !error && !isConfirmed && (
                            <div>Waiting for user confirmation . . .</div>
                        )}
                        {isConfirming && !error && <div>Waiting for confirmation...</div>}
                        {isConfirmed && <div>Transaction confirmed.</div>}
                        {hash && (
                            <div className='mt-2'>
                                <a
                                    className='bg-slate-200 border border-slate-400 p-0.5 px-1 rounded-md inline-block'
                                    href={`https://testnet.snowtrace.io/tx/${hash}`}
                                    target="_blank" rel="noopener noreferrer"
                                > View on Explorer</a>
                            </div>
                        )}
                        {error && (
                            <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                        )}
                    </div>
                </div>
            )}

            <form className="p-4" onSubmit={submit}>
                <div className='mt-4 ml-4 w-11/12 text-xs rounded-r-full bg-primary flex items-center'>
                    <div className="flex items-center">
                        <span className="ml-4">Current price: <br /> 1340$ </span>
                    </div>
                    <span className='text-right w-60'>  Call/Put</span>
                    <span className="ml-auto text-center">
                        <input
                            type="checkbox"
                            name="isCall"
                            className="toggle toggle-error toggle-xs"
                        />
                    </span>
                </div>

                <label className="input p-3 input-bordered flex items-center gap-3">
                    Strike
                    <input name="strike" type="text" className="focus:outline-none grow p-3 text-right" required />
                </label>
                <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                    Premium cost
                    <input name="premium" type="text" className="focus:outline-none grow p-3 text-right" required />
                </label>
                <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                    Units
                    <input name="units" type="text" className="focus:outline-none grow p-3 text-right" required />
                </label>
                <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                    Cap per unit
                    <input name="capPerUnit" type="text" className="focus:outline-none grow p-3 text-right" required />
                </label>
                <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                    Expiration Date
                    <input name="expirationDate" type="date" className="focus:outline-none grow p-3 text-right" required />
                </label>
                <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                    Buy-in deadline
                    <input name="deadlineDate" type="date" className="focus:outline-none grow p-3 text-right" required />
                </label>
                <div className="flex items-center mt-4 justify-end">
                    <span className="text-blue-500 mb-4 mr-4">Lock 93892 USDC</span>
                    <button
                        type="submit"
                        className="text-white relative mb-4 mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center"
                    >
                        Confirm
                    </button>
                </div>
            </form>
        </>
    );
}

export default CreateOption;
