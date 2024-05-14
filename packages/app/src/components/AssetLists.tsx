"use client";

import Ethereum from '@/assets/icons/ethereum.png'
import React, { useEffect, useState } from 'react'
import equities from '@/utils/list-equities'
import gasCosts from '@/utils/list-gas'
import misc from '@/utils/list-misc'
import WriteOptionForm from './WriteForm';
import CustomList from './CustomList';
export default function AssetLists() {
    const [isWriteOptionOpen, setIsWriteOptionOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal open/close
    const [selectedItem, setSelectedItem] = useState('');
    const [sidebarContent, setSidebarContent] = useState<any[]>([]);
    const [selectedImg, setSelectedImg] = useState('');
    const [writingUrl, setwritingUrl] = useState('');
    const [writingName, setWritingName] = useState('');
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





    const handleCloseWriteOption = () => {
        setIsWriteOptionOpen(false);
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
        const fetchData = async () => {
            if (selectedItem) {
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
                                    options(where: {deadlineDate_gt: "${BigInt(currentTimestamp).toString()}", isDeleted: null, name: "${selectedItem}"}) {
                                        id
                                        isCall
                                        premium
                                        expirationDate
                                        deadlineDate
                                        countervalue
                                        desc
                                        name
                                        strikePrice
                                        capPerUnit
                                        unitsLeft
                                        units
                                    }
                                }
                            `
                        })
                    });
                    const data = await response.json();
                    if (data && data.data && data.data.options) {
                        setSidebarContent(data.data.options);
                        console.log(sidebarContent);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        if (isModalOpen && selectedItem) {
            fetchData();
        }
    }, [isModalOpen, selectedItem]);


    const handleCounter = (expirationTimestamp: number) => {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const differenceSeconds = expirationTimestamp - currentTimestamp; // Difference in seconds

        const days = Math.floor(differenceSeconds / (60 * 60 * 24)); // Calculate days
        const hours = Math.floor((differenceSeconds % (60 * 60 * 24)) / (60 * 60)); // Calculate remaining hours
        const minutes = Math.floor((differenceSeconds % (60 * 60)) / 60); // Calculate remaining minutes
        const seconds = differenceSeconds % 60; // Calculate remaining seconds

        return { days, hours, minutes, seconds };
    };

    return (
        <>

            {isWriteOptionOpen && (
                <WriteOptionForm url={writingUrl} name={writingName} onClose={handleCloseWriteOption} />
            )}
            <div className="drawer drawer-end">
                <div role="tablist" className="tabs tabs-lifted">
                    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100" aria-label="Equities" defaultChecked />
                    <div role="tabpanel" className="tab-content bg-primary border-base-300  p-6">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="ml-12 px-8 py-3">
                                        <div className="flex items-center">
                                            {/* Add any header content here */}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Asset
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Source
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Data Source
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Strike type
                                    </th>

                                    <th scope="col" className="px-4 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {equities.map((item, index) => (
                                    <tr key={index} className="bg-white text-xs border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <td className="w-4 ">
                                            <img className="w-10 ml-4 h-10 rounded-full opacity-100" src={item.imageUrl} alt={item.assetName + " Logo"} />
                                        </td>
                                        <th scope="row" className="flex items-center px-4 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="">
                                                <div className="text-base font-semibold">{item.assetName}</div>
                                                <div className="font-normal text-gray-500">{item.assetType}</div>
                                            </div>
                                        </th>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Opto
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            Chainlink Price Feed
                                        </td>


                                        <td className="px-4 py-4">
                                            Exact price on expiration
                                        </td>
                                        <td className="px-4 py-4">
                                            {/* Modal toggle */}
                                            <button type="button" onClick={() => handleBuyClick(item.assetName, item.imageUrl)} className="text-white text-xs  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">Buy</button>
                                            <button type="button" onClick={() => { setWritingName(item.assetName); setwritingUrl(item.imageUrl); setIsWriteOptionOpen(true) }} className="text-white text-xs  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">Write</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>

                    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100 " aria-label="Gas&Blob" />
                    <div role="tabpanel" className="tab-content bg-primary border-base-300  border-slate-100 p-6">



                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="ml-12 px-8 py-3">
                                        <div className="flex items-center">


                                        </div>
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Asset
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Source
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Data Source
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Strike type
                                    </th>

                                    <th scope="col" className="px-4 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {gasCosts.map((item, index) => (
                                    <tr key={index} className="bg-white text-xs  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <td className="w-4">
                                            <img className="w-12 ml-4 h-8 rounded-full opacity-100" src={item.imageUrl} alt={item.assetName + " Logo"} />
                                        </td>
                                        <th scope="row" className="flex items-center px-4 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="">
                                                <div className="text-base font-semibold">{item.assetName}</div>
                                                <div className="font-normal text-gray-500">{item.assetType}</div>
                                            </div>
                                        </th>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Opto
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            Onchain / Subgraph
                                        </td>


                                        <td className="px-4 py-4">
                                            Average price
                                        </td>
                                        <td className="px-4 py-4">
                                            {/* Modal toggle */}
                                            <button type="button" onClick={() => handleBuyClick(item.assetName, item.imageUrl)} className="text-white text-xs  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">Buy</button>
                                            <button type="button" onClick={() => { setWritingName(item.assetName); setwritingUrl(item.imageUrl); setIsWriteOptionOpen(true) }} className="text-white text-xs  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">Write</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100" aria-label="Misc." />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300  p-6">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="ml-12 px-8 py-3">
                                        <div className="flex items-center">


                                        </div>
                                    </th>
                                    <th scope="col" className="px-4 py-3 ">
                                        Asset
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Source
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Data Source
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Strike type
                                    </th>

                                    <th scope="col" className="px-4 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {misc.map((item, index) => (
                                    <tr key={index} className="bg-white text-xs  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <td className="w-4">
                                            <img className="w-10 ml-4 h-10 rounded-full opacity-100" src={item.imageUrl} alt={item.assetName + " Logo"} />
                                        </td>
                                        <th scope="row" className="flex items-center px-4 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="">
                                                <div className="text-base font-semibold">{item.assetName}</div>
                                                <div className="font-normal text-gray-500">{item.assetType}</div>
                                            </div>
                                        </th>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Opto
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            Chainlink Price Feed
                                        </td>


                                        <td className="px-4 py-4">
                                            Exact price on expiration
                                        </td>
                                        <td className="px-4 py-4">
                                            {/* Modal toggle */}

                                            <button type="button" onClick={() => handleBuyClick(item.assetName, item.imageUrl)} className="text-white text-xs  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">Buy</button>
                                            <button type="button" onClick={() => { setWritingName(item.assetName); setwritingUrl(item.imageUrl); setIsWriteOptionOpen(true) }} className="text-white text-xs  bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2 ">Write</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100" aria-label="Crypto" disabled />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300  p-6"></div>

                    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100" aria-label="Custom" />
                    <div role="tabpanel" className="tab-content bg-base-100 border-base-300  p-6">

                        <CustomList />

                    </div>
                </div>
                <div>


                    {isModalOpen && (
                        <>
                            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">

                                <label htmlFor="my-drawer-4" className="" />
                            </div>
                            <div className="drawer-side z-8">

                                <label htmlFor="my-drawer-4" onClick={() => { setSelectedItem(''); setIsModalOpen(false) }} aria-label="close sidebar" className="drawer-overlay"></label>
                                <ul className="menu w-2/3  p-0 min-h-full bg-base-200 text-base-content">

                                    <div className='mt-28 w-1/4 rounded-r-full bg-primary flex items-center'>

                                        <img className=" p-2 ml-2 h-16 rounded-full opacity-100" src={selectedImg} />
                                        <span className="text-2xl">{selectedItem}</span>
                                        <span className="ml-4">Current price: <br /> 1340$ </span>

                                    </div>
                                    {/* Sidebar content here */}
                                    <table className="w-full  text-sm mt-8 text-left rtl:text-right text-gray-500 dark:text-gray-400">

                                        <thead className="text-xs w-full p-0 mx-0 text-gray-700  bg-primary dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">
                                                    OptoId
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Call/Put
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Premium Cost
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Available Units
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Unit Cap
                                                </th>

                                                <th scope="col" className="px-4 py-3">
                                                    Strike Price
                                                </th>

                                                <th scope="col" className="px-2 py-3 w-40">
                                                    Expiry
                                                </th>
                                                <th scope="col" className="px-2 py-3 w-40">
                                                    Expiry
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Buy
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sidebarContent && sidebarContent.length == 0 && (<>      <tr>
                                                <td colSpan="12" className="text-center  py-4">
                                                    <div className="flex text-lg justify-center mt-40 items-center h-full">

                                                        <span>No option available for {selectedItem}</span>
                                                    </div>
                                                </td>
                                            </tr></>)}
                                            {sidebarContent && Array.isArray(sidebarContent) && sidebarContent.map((option, index) => (<>
                                                <tr key={index} className="bg-white w-full text-xs border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    <td className="w-4 px-6">
                                                        #{option.id}
                                                    </td>

                                                    {option.isCall ? (
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>Call
                                                            </div>
                                                        </td>
                                                    ) : (<td className="px-4 py-4">
                                                        <div className="flex items-center">
                                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>Put
                                                        </div>
                                                    </td>)}
                                                    <td className="w-4 px-6">
                                                        ${option.premium}
                                                    </td>
                                                    <td className="px-4 ">
                                                        {option.unitsLeft}/{option.units}
                                                    </td>
                                                    <td className="px-4 ">
                                                        ${option.capPerUnit}
                                                    </td>
                                                    <td className="px-4 ">
                                                        ${option.strikePrice}
                                                    </td>
                                                    <td className="px-2 w-50 ">
                                                        <div className="stats  bg-primary text-primary-content">

                                                            <div className="stat py-1 border rounded-2xl my-0 bg-secondary">



                                                                <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                                                                    <div className="flex flex-col py-1 px-3 pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                                                        <span className="text-center font-mono text-xs">D</span>
                                                                        <span className="countdown font-mono text-xs">
                                                                            <span style={{ "--value": `${handleCounter(option.deadlineDate).days}` } as React.CSSProperties}></span>
                                                                        </span>

                                                                    </div>
                                                                    <div className="flex flex-col py-1 px-3  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                                                        <span className="text-center font-mono text-xs">H</span>
                                                                        <span className="countdown font-mono text-xs">
                                                                            <span style={{ "--value": `${handleCounter(option.deadlineDate).hours}` } as React.CSSProperties}></span>
                                                                        </span>

                                                                    </div>
                                                                    <div className="flex flex-col py-1 px-3  pt-0 bg-slate-100 border rounded-md text-neutral-content">
                                                                        <span className="text-center font-mono text-xs">M</span>
                                                                        <span className="countdown font-mono text-xs">
                                                                            <span style={{ "--value": `${handleCounter(option.deadlineDate).minutes}` } as React.CSSProperties}></span>
                                                                        </span>

                                                                    </div>
                                                                    <div className="flex flex-col py-1 px-3 pt-0  bg-slate-100 border rounded-md text-neutral-content">
                                                                        <span className="text-center font-mono text-xs">S</span>
                                                                        <span className="countdown font-mono text-xs">
                                                                            <span style={{ "--value": `${handleCounter(option.deadlineDate).seconds}` } as React.CSSProperties}></span>
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>
                                                    </td>
                                                    <td className="px-2 ">
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

                                                            </div>

                                                        </div>
                                                    </td>

                                                    <td className="px-4 ">
                                                        <form style={{ position: 'relative' }}>
                                                            <label className="form-control w-full max-w-xs">
                                                                <input type="text" placeholder="Select units" className="input input-xs input-bordered w-full max-w-xs" />
                                                                <button type="button" onClick={() => { }} className="text-white text-xs bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center absolute right-0 top-0 ">Buy</button>
                                                            </label>
                                                        </form>
                                                    </td>
                                                </tr>
                                            </>
                                            ))}
                                        </tbody>
                                    </table>
                                </ul>
                            </div>


                        </>)}

                </div>
            </div>
        </>

    );
}