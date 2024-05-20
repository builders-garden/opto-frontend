"use client";
import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { feedABI } from '@/contracts/ChainlinkFeed';

export default function CurrentPrice({ feedAddress }) {
    const [currentPrice, setCurrentPrice] = useState('');

    const { data: answer } = useReadContract({
        abi: feedABI,
        address: feedAddress,
        functionName: 'latestAnswer',
        args: [],
        chainId: arbitrum.id,
    });

    useEffect(() => {
        if (answer) {
            setCurrentPrice(answer.toString());
        }
    }, [answer]);  // Add 'answer' as a dependency here

    return (
        <>
            <span className="ml-4">Current price: <br /> {currentPrice / 1e8}$</span>
        </>
    );
}
