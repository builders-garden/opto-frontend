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

function CreateOption() {
  
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


    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
     
            e.preventDefault() 
            const formData = new FormData(e.target as HTMLFormElement) 
            const strike = formData.get('strike') as string 
            const premium = formData.get('premium') as string
            const units = formData.get('units') as string
            const expirationDate = formData.get('expirationDate') as string
            const deadlineDate = formData.get('deadlineDate') as string
            const isCall = formData.get('isCall') 
            const capPerUnit = formData.get('capPerUnit') as string
            const unixDead = Math.floor(new Date( deadlineDate).getTime() / 1000);
            const unixExp = Math.floor(new Date(expirationDate).getTime() / 1000);
        try {
            writeContract({
                address: OptoAddress,
                abi: OptoAbi,
                functionName: 'createOption',
                args: [!isCall, BigInt(premium), BigInt(strike), BigInt(unixDead), BigInt(unixExp), 1, BigInt(1), BigInt(1), BigInt(units), BigInt(capPerUnit)], // Convert units to BigInt
            });
         
        } catch (err) {
            console.error(err); // Log any errors
        }
  
    }





    return (  <> <form className="p-4" onSubmit={submit}>
   <div className='mt-4 ml-4 w-11/12 text-xs rounded-r-full bg-primary flex items-center'>
                        <div className="flex items-center">

                        </div>
                        <div className="flex items-center">
                            <span className="ml-4">Current price: <br /> 1340$ </span>
                        </div>
                        <span className='text-right w-60'>  Call/Put</span><span className="ml-auto text-center" ><input type="checkbox"  name="isCall" className="toggle toggle-xs" /></span>
                    </div>
      

        <label className="input p-3 input-bordered flex items-center gap-3">
            Strike
            <input name="strike" type="text" className="focus:outline-none grow p-3 text-right " required />
        </label>
        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
            Premium cost
            <input name="premium" type="text" className="focus:outline-none grow p-3 text-right " required />
        </label>
        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
            Units
            <input name="units" type="text" className="focus:outline-none grow p-3 text-right" required />
        </label>
        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
            Cap per unit
            <input name="capPerUnit" type="text" className="focus:outline-none grow p-3 text-right " required />
        </label>
        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
            Expiration Date
            <input  name="expirationDate" type="date" className="focus:outline-none grow p-3 text-right" required />
        </label>
        <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
            Buy-in deadline
            <input  name="deadlineDate" type="date" className="focus:outline-none grow p-3 text-right" required />
        </label>
        <div className="flex items-center justify-end">
        <span className="text-blue-500 mb-4 mr-4 ">Lock 93892 USDC</span>
        <button type="submit" className="text-white relative mb-4 mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center">Confirm</button>
    </div>
    </form>
   
    </>
    );
}

export default CreateOption;
