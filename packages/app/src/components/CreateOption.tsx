import React, { useState, useEffect } from 'react';
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount,
    useReadContract 
} from 'wagmi';
import { OptoAddress, OptoAbi } from '@/contracts/Opto_ABI';
import { USDC_ABI, UsdcAddress } from '@/contracts/Usdc_ABI';
import { polygonAmoy } from 'wagmi/chains';
import CurrentPrice from './CurrPrice';
import GasCurrPrice from './GasCurrPrice';

interface CreateOptionProps {
    type: number;
    queryId: number;
    assetId: number;
    feedAddress: string;
}

function CreateOption({ type, queryId, assetId, feedAddress }: CreateOptionProps) {
    const [transacting, setTransacting] = useState(false);
    const account = useAccount();
    const [allowance, setAllowance] = useState('');
    const [strike, setStrike] = useState('');
    const [premium, setPremium] = useState('');
    const [units, setUnits] = useState('');
    const [expirationDate, setExpirationDate] = useState(BigInt(0));
    const [deadlineDate, setDeadlineDate] = useState(BigInt(0));
    const [isCall, setIsCall] = useState(false); 
    const [capPerUnit, setCapPerUnit] = useState('');
    const [lockedUSDC, setLockedUSDC] = useState(0);

    const [step, setStep] = useState(0);
    const {
        data: hash,
        isPending,
        error,
        writeContract
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    const convertToWei = (value: string) => {
        return BigInt(Math.floor(parseFloat(value) * 10**6));
    };

    const isValidInput = (value: string) => {
        return parseFloat(value) >= 0.000001;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const s_strike = formData.get('strike') as string;
        const s_premium = formData.get('premium') as string;
        const s_units = formData.get('units') as string;
        const s_expirationDate = formData.get('expirationDate') as string;
        const s_deadlineDate = formData.get('deadlineDate') as string;
        const s_capPerUnit = formData.get('capPerUnit') as string;

        const unixDead = BigInt(Math.floor(new Date(s_deadlineDate).getTime() / 1000));
        const unixExp = BigInt(Math.floor(new Date(s_expirationDate).getTime() / 1000));
        if (!isValidInput(s_strike) || !isValidInput(s_premium) || !isValidInput(s_capPerUnit)) {
            alert('Values must be at least 0.000001');
            return;
        }

    
        const isCallValue = formData.get('isCall') === 'on'; 

        setIsCall(isCallValue);
        setStrike(s_strike);
        setPremium(s_premium);
        setUnits(s_units);
        setExpirationDate(unixExp);
        setDeadlineDate(unixDead);
        setCapPerUnit(s_capPerUnit);
        setStep(1);
        setTransacting(true);

        try {
            await writeContract({
                address: UsdcAddress,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [OptoAddress, BigInt(units) * convertToWei(s_capPerUnit)],
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isConfirmed && step === 1) {
            const timeout = setTimeout(() => {
                setStep(2);
                try {
                    writeContract({
                        address: OptoAddress,
                        abi: OptoAbi,
                        functionName: 'createOption',
                        args: [
                            !isCall,
                            convertToWei(premium),
                            convertToWei(strike),
                            deadlineDate,
                            expirationDate,
                            type,
                            BigInt(queryId),
                            BigInt(assetId),
                            BigInt(units),
                            convertToWei(capPerUnit)
                        ],
                    });
                } catch (err) {
                    console.error(err);
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

    useEffect(() => {
        const capValue = parseFloat(capPerUnit);
        const unitsValue = parseFloat(units);
        if (!isNaN(capValue) && !isNaN(unitsValue)) {
            setLockedUSDC(capValue * unitsValue);
        } else {
            setLockedUSDC(0);
        }
    }, [capPerUnit, units]);

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
                                    className='bg-neutral px-2 py-2 w-full rounded-lg text-xs text-white'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href={`https://amoy.polygonscan.com/tx/${hash}`}
                                >
                                    View on polygonscan
                                </a>
                            </div>
                        )}
                           {error && (
                            <div>Error: {(error as any).shortMessage || error.message}</div>
                        )}
                    </div>
                </div>
            )}

            <form className="p-4" onSubmit={submit}>
                <div className='mt-4 mb-4 ml-4 w-11/12 text-xs rounded-r-full bg-primary flex items-center'>
                    <div className="flex items-center">
                        {feedAddress.startsWith('0x') ? (
                            <CurrentPrice feedAddress={feedAddress} />
                        ) : (
                            <GasCurrPrice url={feedAddress} queryId={queryId} />
                        )}
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

                <label className="input p-3  text-xs input-bordered flex items-center gap-3">
                    Strike
                    <input
                        name="strike"
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        className="focus:outline-none grow p-3 text-right"
                        required
                    />
                </label>
                <label className="input p-3  text-xs mt-2 input-bordered flex items-center gap-3">
                    Premium cost
                    <input
                        name="premium"
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        className="focus:outline-none grow p-3 text-right"
                        required
                    />
                </label>
                <label className="input p-3  text-xs mt-2 input-bordered flex items-center gap-3">
                    Units
                    <input
                        name="units"
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        className="focus:outline-none grow p-3 text-right"
                        required
                        onChange={(e) => setUnits(e.target.value)}
                    />
                </label>
                <label className="input p-3  text-xs mt-2 input-bordered flex items-center gap-3">
                    Cap per unit
                    <input
                        name="capPerUnit"
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        className="focus:outline-none grow p-3 text-right"
                        required
                        onChange={(e) => setCapPerUnit(e.target.value)}
                    />
                </label>
                <label className="input p-3  text-xs mt-2 input-bordered flex items-center gap-3">
                    Expiration Date
                    <input
                        name="expirationDate"
                        type="datetime-local"
                        className="focus:outline-none grow p-3 text-right"
                        required
                    />
                </label>
                <label className="input p-3  text-xs mt-2 input-bordered flex items-center gap-3">
                    Buy-in deadline
                    <input
                        name="deadlineDate"
                        type="datetime-local"
                        className="focus:outline-none grow p-3 text-right"
                        required
                    />
                </label>
                <div className="flex items-center mt-4 justify-end">
                    <span className="text-blue-500 mb-4 mr-4">
                        Lock {lockedUSDC.toFixed(6)} USDC
                    </span>
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