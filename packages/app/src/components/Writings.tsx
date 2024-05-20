"use client";
import { useState, useEffect } from 'react';
import gold from "@/assets/icons/assetlogos/gold.png";
import silver from "@/assets/icons/assetlogos/silver.png";
import amazon from "@/assets/icons/assetlogos/amazon.png";
import apple from "@/assets/icons/assetlogos/apple.png";
import coinbase from "@/assets/icons/assetlogos/coinbase.png";
import google from "@/assets/icons/assetlogos/google.png";
import microsoft from "@/assets/icons/assetlogos/microsoft.png";
import nvidia from "@/assets/icons/assetlogos/nvidia.png";
import tesla from "@/assets/icons/assetlogos/tesla.png";
import gaseth from "@/assets/icons/assetlogos/gas-eth.png";
import gasavax from "@/assets/icons/assetlogos/gas-avax.png";
import gasbnb from "@/assets/icons/assetlogos/gas-bnb.png";
import blobeth from "@/assets/icons/assetlogos/blob-eth.png";
import custom from "@/assets/icons/assetlogos/custom.png";
import { Account } from 'viem';
import { useAccount } from 'wagmi';
import CancelBtn from "./CancelBtn"
export default function Writings() {
    const [writings, setWritings] = useState([]);
    const imgMapping = {
        gold: gold.src,
        silver: silver.src,
        amazon: amazon.src,
        apple: apple.src,
        coinbase: coinbase.src,
        alphabet: google.src,
        microsoft: microsoft.src,
        nvidia: nvidia.src,
        tesla: tesla.src,
        gaseth: gaseth.src,
        gasavax: gasavax.src,
        gasbnb: gasbnb.src,
        blobeth: blobeth.src

    };
    const account = useAccount()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const response = await fetch('https://api.studio.thegraph.com/query/73482/opto/version/latest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: `
                            {
                                options(
                                    where: {writer_contains_nocase: "${account.address}", expirationDate_gt:"${currentTimestamp}", isDeleted: null}
                                ) {
                                    id
                                    expirationDate
                                    premium
                                    premiumCollected
                                    units
                                    name
                                    unitsLeft
                                    strikePrice
                                    responseValue
                                    countervalue
                                    capPerUnit
                                    isCall
                                }
                            }
                        `
                    })
                });
                const data = await response.json();
                if (data && data.data && data.data.options) {
                    setWritings(data.data.options);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Fetch data initially
        fetchData();

        // Fetch data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [account.address]);

    const handleCounter = (expirationTimestamp) => {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const differenceSeconds = expirationTimestamp - currentTimestamp; // Difference in seconds

        const days = Math.floor(differenceSeconds / (60 * 60 * 24)); // Calculate days
        const hours = Math.floor((differenceSeconds % (60 * 60 * 24)) / (60 * 60)); // Calculate remaining hours
        const minutes = Math.floor((differenceSeconds % (60 * 60)) / 60); // Calculate remaining minutes
        const seconds = differenceSeconds % 60; // Calculate remaining seconds

        return { days, hours, minutes, seconds };
    };

    return (
        <>  <div className="stats stats-vertical   gap-2 flex m-auto mb-4 lg:stats-horizontal shadow">

            <div className="stat rounded-xl bg-slate-200">
                <div className="stat-title ">Active as Writer</div>
                <div className="stat-value text-sm ">2</div>

            </div>
            <div className="stat rounded-xl bg-slate-200">
                <div className="stat-title">Ever created</div>
                <div className="stat-value text-sm ">200</div>
            </div>
            <div className="stat rounded-xl bg-slate-200">
                <div className="stat-title">Unit sold</div>
                <div className="stat-value text-sm ">200</div>
            </div>

            <div className="stat rounded-xl bg-slate-200">
                <div className="stat-title">Total premium</div>
                <div className="stat-value text-sm  text-green-600">+1200$</div>
            </div>
            <div className="stat rounded-xl bg-slate-200">
                <div className="stat-title">Total gain</div>
                <div className="stat-value text-sm  text-green-600">+840$</div>
            </div>




        </div>
            <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="ml-4 px-6 py-3">
                            <div className="flex items-center"></div>
                        </th>
                        <th scope="col" className="px-2 py-3">Asset</th>
                        <th scope="col" className="px-2 py-3">Call/Put</th>
                        <th scope="col" className="px-2 py-3">Premium</th>
                        <th scope="col" className="px-2 py-3">Sold</th>
                        <th scope="col" className="px-2 py-3">Strike Price</th>
                 
                        <th scope="col" className="px-2 py-3">Loss cap</th>
                        <th scope="col" className="px-2 py-3">Expiry</th>
                        <th scope="col" className="px-2 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {writings.map((option, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600" key={index}>
                            <td className="w-4 text-xs">
                                <div className="flex">
                                {((imgMapping[option.name.toLowerCase()] || custom.src) && 
    (option.name.toLowerCase() !== "gaseth" &&
    option.name.toLowerCase() !== "blobeth" &&
    option.name.toLowerCase() !== "gasbnb" &&
    option.name.toLowerCase() !== "gasavax")
) ? (
    <img className="w-10 ml-2 h-10 rounded-full opacity-100" src={imgMapping[option.name.toLowerCase()] || custom.src} />
) : (
    <img className="w-10 ml-2 h-7 rounded-full opacity-100" src={imgMapping[option.name.toLowerCase()] || custom.src} />
)}

                              


                                    <div className="font-normal text-gray-400">#{option.id}</div>
                                </div>
                            </td>
                            <td className='w-32 text-xs px-2 text-xs py-2'>{option.name}</td>
                            <td className="px-2 text-xs py-2">
                                <div className="flex items-center">
                                    {option.isCall ? <><div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Call</> : <><div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div> Put</>}
                                </div>
                            </td>
                            <td className="px-2 text-xs py-2">{option.premium / 1e6} $</td>
                            <td className="px-2 text-xs py-2">{option.unitsLeft}/{option.units}</td>
                            <td className="px-2 text-xs py-2">{option.strikePrice}</td>
             
                            <td className="px-2 text-xs py-2">{option.countervalue / 1e6} $</td>
                            <td className="px-2 text-xs py-2">
                                <div className="stats bg-primary text-primary-content">
                                    <div className="stat py-1 border rounded-2xl my-0 bg-secondary">
                                        <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
                                            <div className="flex flex-col py-1 px-3 pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                                <span className="text-center font-mono text-xs">D</span>
                                                <span className="countdown font-mono text-xs">
                                                    <span style={{ "--value": `${handleCounter(option.expirationDate).days}` } as React.CSSProperties}></span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col py-1 px-3  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                                <span className="text-center font-mono text-xs">H</span>
                                                <span className="countdown font-mono text-xs">
                                                    <span style={{ "--value": `${handleCounter(option.expirationDate).hours}` } as React.CSSProperties}></span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col py-1 px-3  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                                <span className="text-center font-mono text-xs">M</span>
                                                <span className="countdown font-mono text-xs">
                                                    <span style={{ "--value": `${handleCounter(option.expirationDate).minutes}` } as React.CSSProperties}></span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col py-1 px-3 pt-0  bg-slate-100 border rounded-md text-neutral-content">
                                                <span className="text-center font-mono text-xs">S</span>
                                                <span className="countdown font-mono text-xs">
                                                    <span style={{ "--value": `${handleCounter(option.expirationDate).seconds}` } as React.CSSProperties}></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="stat-actions mt-0 p-0"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-2 py-2 text-xs">
                                {!(option.unitsLeft != option.units) && (<CancelBtn optionId={option.id}/>)}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
