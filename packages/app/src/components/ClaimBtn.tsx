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
                address: OptoAddress,
                abi: OptoAbi,
                functionName: 'claimOption',
                args: [BigInt(optionId)], // Convert units to BigInt
            });
         
        } catch (err) {
            console.error(err); // Log any errors
        }
        

    }






    return (

        <form style={{ position: 'relative' }} onSubmit={submit}>
          
              <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">
                Claim
                    {isPending ? 'Confirming...' : 'Buy'}
                </button>
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
   
        </form>
    );
}

export default ClaimBtn;
