"use client";
import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { feedABI } from '@/contracts/ChainlinkFeed';

export default function GasCurrPrice({ url, queryId }) {
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentEthPrice, setEthCurrentPrice] = useState(0);

    const { data: ethPrice } = useReadContract({
        abi: feedABI,
        address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612" as `0x${string}`,
        functionName: 'latestAnswer',
        args: [],
        chainId: arbitrum.id,
    });

    useEffect(() => {
        if (ethPrice) {

            setEthCurrentPrice(Number(BigInt(ethPrice) / BigInt(1e8)));
        }
    }, [ethPrice]);  


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine the query based on queryId
                let query = `
                    {
                        feeAggregator(id: "init") {
                            gas_average_daily
                        }
                    }
                `;

                if (queryId === 3) {
                    query = `
                        {
                            feeAggregator(id: "init") {
                                blob_average_daily
                            }
                        }
                    `;
                }

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                const data = await response.json();
                console.log(data.data);

                if (data && data.data && data.data.feeAggregator) {
                    const price = queryId === 3 ? data.data.feeAggregator.blob_average_daily : data.data.feeAggregator.gas_average_daily;
                    setCurrentPrice(price / 1e6);
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
    }, [url, queryId]);
    const finalValue = Math.floor((Number(currentEthPrice) * Number(currentPrice)) / 1e6) / 1e6;
    return (
        <>
            <span className="ml-4">Current price: <br /> {Number(currentPrice) }$ {finalValue}</span>
        </>
    );
}
