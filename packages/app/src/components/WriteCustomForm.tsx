import React, { useRef, useState,useEffect } from 'react';
import custom from "@/assets/icons/assetlogos/custom.png";
import Prism from 'prismjs';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { OptoAddress, OptoAbi } from '@/contracts/Opto_ABI';
import { USDC_ABI, UsdcAddress } from '@/contracts/Usdc_ABI'
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount,
    useReadContract
} from 'wagmi'

const WriteCustomForm = ({ onClose }) => {
    const [code, setCode] = useState(
        `Paste your Function() script here.  //Avoid comments like this`
    );
    const [transacting, setTransacting] = useState(false);
    const [strike, setStrike] = useState('');
    const [premium, setPremium] = useState('');
    const [units, setUnits] = useState('');
    const [expirationDate, setExpirationDate] = useState(BigInt(0));
    const [deadlineDate, setDeadlineDate] = useState(BigInt(0));
    const [isCall, setIsCall] = useState(false); // Assuming it's a boolean
    const [capPerUnit, setCapPerUnit] = useState('');
    
    
    const [step, setStep] = useState(0);
    const {
        data: hash,
        isPending,
        error,
        writeContract
    } = useWriteContract();

    // Check if transaction is pending or confirmed
    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

      
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        
        
        const formData = new FormData(e.target as HTMLFormElement)

        const rawScript = formData.get('script') as string
        const result = minify(rawScript);
        console.log(result);

        const strike = formData.get('strike') as string
        const premium = formData.get('premium') as string
        const units = formData.get('units') as string
        const expirationDate = formData.get('expirationDate') as string
        const deadlineDate = formData.get('deadlineDate') as string
        
        const capPerUnit = formData.get('capPerUnit') as string
        const unixDead = BigInt(Math.floor(new Date(deadlineDate).getTime() / 1000));
        const unixExp = BigInt(Math.floor(new Date(expirationDate).getTime() / 1000));
        const isCallValue = formData.get('isCall');
        const isCall = isCallValue === 'true'; // Convert string to boolean
        setIsCall(!!isCall);
        setStrike(strike);
        setPremium(premium);
        setUnits(units);
        setExpirationDate(unixExp);
        setDeadlineDate(unixDead);
        setIsCall(isCall);
        setCapPerUnit(capPerUnit);
        setStep(1);
        setTransacting(true)
        try {
            writeContract({
                address: UsdcAddress,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [OptoAddress, BigInt(units) * BigInt(capPerUnit)], // Convert units to BigInt
            });
        } catch (err) {
            console.error(err); // Log any errors
        }

    }
    useEffect(() => {
        if (isConfirmed && step === 1) {
            const timeout = setTimeout(() => {
                setStep(2);
                console.log("coddiaccio")
                try {
                    writeContract({
                        address: OptoAddress,
                        abi: OptoAbi,
                        functionName: 'createOption',
                        args: [!isCall, BigInt(premium), BigInt(strike), BigInt(deadlineDate), BigInt(expirationDate), 1, BigInt(1), BigInt(1), BigInt(units), BigInt(capPerUnit)], // Convert units to BigInt
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
        <div className='items-center w-full'>

            <div id="crud-modal" aria-hidden="true" className="fixed inset-0 w-full z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white w-8/12 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                        <img className="w-10 ml-4 h-10 rounded-full opacity-100" src={custom.src} />
                        <h1 className='text-2xl'>Custom</h1>
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

                     
                    </div>
                    <form className="p-4 flex flex-col md:flex-row md:items-start md:gap-4" onSubmit={submit}>
                        
                        <div className="w-30">   <span className='text-right w-full ml-auto mr-4'>  Call/Put</span><span className="ml-auto mt-1 text-center" ><input type="checkbox" className="toggle relative top-0.5 toggle-xs" /></span> {/* Left Column - 30% width on medium screens and above */}
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Name
                                <input name="name" type="text" className="grow p-3 text-right" required />
                            </label>
                            <label className="input text-xs p-3 mt-2 input-bordered flex items-center gap-3">
                                Description
                                <input name="description" type="text" className="grow p-3 text-right" required />
                            </label>
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
                <input name="expirationDate" type="date" className="focus:outline-none grow p-3 text-right" required />
            </label>
            <label className="input p-3 mt-2 input-bordered flex items-center gap-3">
                Buy-in deadline
                <input name="deadlineDate" type="date" className="focus:outline-none grow p-3 text-right" required />
            </label>
                        </div>
                        <div className="w-full md:w-70"> {/* Right Column - 70% width on medium screens and above */}
                        <button
                            type="button"
                            onClick={() => window.open('https://functions.chain.link/playground')}
                            className="text-white relative  text-xs bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center"
                        >
                            Open Playground
                        </button>
                               
                    <CodeEditor
                        value={code}
                        minHeight={420}
                        language="js"
                        name='script'
                        placeholder="Write your Function() script"
                        onChange={(evn) => setCode(evn.target.value)}
                        padding={10}
                        className='block h-full p-2.5 w-full mt-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        style={{
                            backgroundColor: "#f5f5f5", maxHeight: '420px', overflowY: 'auto',
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />

<span className="text-blue-500 mb-4 mr-4 ">Lock 93892 USDC</span>
                <button type="submit" className="text-white relative mb-4 mr-4 text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center">Confirm</button>
                        </div>
                    </form>
                
                   <div className="flex items-center justify-end">
                
            </div>
                </div>
            </div >
        </div >
    );
};

export default WriteCustomForm;