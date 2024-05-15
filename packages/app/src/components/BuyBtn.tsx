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

function BuyBtn({ optionId, maxunits, premium }) {
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


    const submit = async (e) => {
        e.preventDefault(); // Preve
        try {
            writeContract({
                address: UsdcAddress,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [OptoAddress, BigInt(units) * BigInt(premium)], // Convert units to BigInt
            });
            setStep(1)
        } catch (err) {
            console.error(err); // Log any errors
        };
        

    }

    useEffect(() => {
        if (isConfirmed) {
            if (step === 1) {

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
                
            }
            if (step === 2){
                console.log("legnorcogeppetto")
            }
        }

    }, [isConfirmed])




    return (

        <form style={{ position: 'relative' }} onSubmit={submit}>
            <label className="form-control w-full max-w-xs">
                <input
                    type="number"
                    className='input input-xs input-bordered w-full max-w-xs'
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="Enter units"
                    required
                    max={maxunits}
                    min={1}
                />
                <button type="submit" disabled={isPending} className='text-white text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center absolute right-0 top-0'>
                    {isPending ? 'Confirming...' : 'Buy'}
                </button>
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
            </label>
        </form>
    );
}

export default BuyBtn;
