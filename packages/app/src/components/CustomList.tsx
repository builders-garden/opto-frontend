"use client";

import Ethereum from '@/assets/icons/ethereum.png'
import React, { useEffect, useState } from 'react'
import equities from '@/utils/list-equities'
import gasCosts from '@/utils/list-gas'
import misc from '@/utils/list-misc'
import WriteOptionForm from './WriteForm';
import WriteCustomForm from './WriteCustomForm';
import BuyBtn from './BuyBtn'
import { useReadContract } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains'
import { OptoAddress, OptoAbi } from '@/contracts/Opto_ABI';
import { USDC_ABI, UsdcAddress } from '@/contracts/Usdc_ABI';

export default function CustomList() {
    const [isWriteOptionOpen, setIsWriteOptionOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal open/close
    const [selectedItem, setSelectedItem] = useState('');
    const [sidebarContent, setSidebarContent] = useState<any[]>([]);
    const [selectedImg, setSelectedImg] = useState('');
    const [writingUrl, setwritingUrl] = useState('');
    const [writingName, setWritingName] = useState('');
    const [writingCustom, setWritingCustom] = useState(false);
    const [query, setQuery] = useState('');
    const [copy, setCopy] = useState(0);
    const [copyNotificationId, setCopyNotificationId] = useState(0);
    const handleBuyClick = (item: string, img: string) => {
        // Update state or perform actions based on the item clicked
        setSelectedItem(item);
        setIsModalOpen(true);
        setSelectedImg(img);
        // Delay triggering the click event to allow time for the element to be available
        setTimeout(() => {
            const drawer = document.getElementById('my-drawer-4');
            if (drawer) {
                drawer.click();
            }
        }, 50);
    };

    const { data: rawQuery } = useReadContract({
        abi: OptoAbi,
        address: OptoAddress,
        functionName: "customOptionQueries",
        args: [
            BigInt(copy)
        ]
    })
    useEffect(()=>{
        if (rawQuery) {
            setQuery(rawQuery);
            // Copy rawQuery to clipboard
            navigator.clipboard.writeText(rawQuery)
                .then(() => {
                    console.log('Text copied to clipboard');
                })
                .catch((err) => {
                    console.error('Could not copy text: ', err);
                });
        }
    },[copy])


    const updateTimers = () => {
        setSidebarContent((prevSidebarContent) => {
            // Update the timers for each item in sidebarContent
            return prevSidebarContent.map((option) => {
                return {
                    ...option,
                    countdown: handleCounter(option.expirationDate) // Assuming handleCounter returns the timer object
                };
            });
        });
    };

    const handleCounter = (expirationTimestamp) => {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const differenceSeconds = expirationTimestamp - currentTimestamp; // Difference in seconds

        const days = Math.floor(differenceSeconds / (60 * 60 * 24)); // Calculate days
        const hours = Math.floor((differenceSeconds % (60 * 60 * 24)) / (60 * 60)); // Calculate remaining hours
        const minutes = Math.floor((differenceSeconds % (60 * 60)) / 60); // Calculate remaining minutes
        const seconds = differenceSeconds % 60; // Calculate remaining seconds

        return { days, hours, minutes, seconds };
    };


    const handleCloseWriteOption = () => {
        setWritingCustom(false);
    };

    // Call updateTimers every second
    useEffect(() => {
        const timer = setInterval(() => {
            updateTimers();
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCopyNotificationId(0)
        }, 2000);

        return () => {
            clearInterval(timer);
        };
    }, [copyNotificationId]);


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
                                options(where: {isCustom: true, deadlineDate_gt: "${BigInt(currentTimestamp).toString()}"}) {
                                    id
                                    name
                                    capPerUnit
                                    countervalue
                                    deadlineDate
                                    expirationDate
                                    hasToPay
                                    isCall
                                    desc
                                    premium
                                    strikePrice
                                    units
                                    unitsLeft
                                    writer
                                }
                            }
                        `
                    })
                });
                const data = await response.json();
                if (data && data.data && data.data.options) {
                    setSidebarContent(data.data.options);

                } else {
                    console.log('Data not received or empty:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Fetch data initially
        fetchData();

        // Fetch data every 4 seconds
        const intervalId = setInterval(fetchData, 4000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


    return (



        <>

            {writingCustom && (
                <WriteCustomForm onClose={handleCloseWriteOption} />
            )}
            <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                <thead className="text-xs w-full p-0 mx-0 text-gray-700  bg-secondary dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-2 py-3">
                            Option
                        </th>
                        <th scope="col" className="px-2 py-3">
                            Call/Put
                        </th>
                        <th scope="col" className="px-2 py-3">
                            Premium Cost
                        </th>
                        <th scope="col" className="px-2 py-3">
                            Available Units
                        </th>
                        <th scope="col" className="px-2 py-3">
                            Unit Cap
                        </th>

                        <th scope="col" className="px-2 py-3">
                            Strike Price
                        </th>

                        <th scope="col" className="px-2 py-3 w-40">
                            Buy-in Deadline
                        </th>
                        <th scope="col" className="px-2 py-3 w-40">
                            Expiry
                        </th>
                        <th scope="col" className="px-2 py-3">
                            Buy
                        </th>
                        <th scope="col" className="px-2 py-3">
                            Code
                        </th>
                    </tr>
                </thead>
                <tbody>     {sidebarContent && Array.isArray(sidebarContent) && sidebarContent.map((option, index) => (
                    <tr key={index} className="bg-white w-full text-xs border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <td className=' text-xs px-2 py-2'>
                            <div className='flex flex-col'>
                                <div className='text-base font-medium'>{option.name}</div>
                                <div className='text-xs text-slate-400'>#{option.id}</div>
                            </div>
                        </td>
                        <td className="px-2 text-xs py-2">
                            <div className="flex items-center">
                                {option.isCall ? (
                                    <>
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-1"></div>
                                        <span>Call</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-1"></div>
                                        <span>Put</span>
                                    </>
                                )}
                            </div>
                        </td>
                        <td className="px-2 text-xs py-2">{option.premium}</td>
                        <td className="px-2 text-xs py-2">{option.unitsLeft}/{option.units}</td>
                        <td className="px-2 text-xs py-2">{option.capPerUnit / 1e6}$</td>
                        <td className="px-2 text-xs py-2">{option.strikePrice / 1e6}$</td>
                        <td className="px-2 ">
                            <div className="stats  bg-primary text-primary-content">

                                <div className="stat py-1 px-3 border rounded-2xl my-0 bg-secondary">



                                    <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                                        <div className="flex flex-col py-1 px-1 pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">D</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.deadlineDate).days}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>
                                        <div className="flex flex-col py-1 px-1  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">H</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.deadlineDate).hours}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>
                                        <div className="flex flex-col py-1 px-1  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">M</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.deadlineDate).minutes}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>
                                        <div className="flex flex-col py-1 px-1 pt-0  bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">S</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.deadlineDate).seconds}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>

                                    </div>
                                    <div className="stat-actions mt-0 p-0">


                                    </div>
                                </div>

                            </div>
                        </td>
                        <td className="px-2 ">
                            <div className="stats bg-primary text-primary-content">

                                <div className="stat py-1 px-3 border rounded-2xl my-0 bg-secondary">



                                    <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                                        <div className="flex flex-col py-1 px-1 pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">D</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.expirationDate).days}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>
                                        <div className="flex flex-col py-1 px-1  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">H</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.expirationDate).hours}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>
                                        <div className="flex flex-col py-1 px-1  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">M</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.expirationDate).minutes}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>
                                        <div className="flex flex-col py-1 px-1 pt-0  bg-slate-100 border rounded-md text-neutral-content">
                                            <span className="text-center font-mono text-xs">S</span>
                                            <span className="countdown font-mono text-xs">
                                                <span style={{ "--value": `${handleCounter(option.expirationDate).seconds}` } as React.CSSProperties}></span>
                                            </span>

                                        </div>

                                    </div>
                                    <div className="stat-actions mt-0 p-0">


                                    </div>
                                </div>

                            </div>
                        </td>

                        <td className="px-4 w-40 relative">
                            <BuyBtn optionId={option.id.toString()} premium={option.premium} maxunits={option.unitsLeft.toString()} />
                        </td>
                        <td className="px-2 text-xs py-2 relative">
                            <div className="inline-block relative">
                                <button
                                    type="button"
                                    onClick={() => { setCopy(option.id); setCopyNotificationId(option.id); }}
                                    className="text-white text-xs bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center"
                                >
                                    <span style={{ fontSize: ".875em", marginRight: ".125em", position: "relative", top: "-.25em", left: "-.125em" }}>
                                        📄<span style={{ position: "absolute", top: ".25em", left: ".25em" }}>📄</span>
                                    </span>
                                </button>
                                {copyNotificationId === option.id && (
                                 <>  <div className="absolute top-4 mr-2 bg-gray-200 text-gray-800 rounded p-1 text-xs shadow-md" style={{animation: `scaleOpacityAnimation  1.2s forwards`,  opacity: 1}}>
                                   Copied!
                               </div>
                               
                               <style>{`
                            @keyframes scaleOpacityAnimation {
                                0% {
                                    opacity: 1;
                                }
                            
                                50% {
                                    opacity: 1;
                                }
                                100% {
                                    opacity: 0;
                                }
                            }
                        `}
                        </style></>
                                )}
                            </div>
                        </td>


                        <button
                            type="button"
                            onClick={() => { setWritingCustom(true) }}
                            className="absolute top-1 right-36 text-white text-xs bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center"
                        >
                            Write 📝
                        </button>

                        <button
                            type="button"
                            onClick={() => window.open('https://functions.chain.link/playground')}
                            className="absolute top-1 right-2 text-white text-xs bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center"
                        >
                            Open Playground
                        </button>
                    </tr>
                ))}
                </tbody>
            </table> </>

    );
}