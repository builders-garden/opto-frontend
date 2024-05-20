"use client";
import React, { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { arbitrum } from 'wagmi/chains'



export default function CurrentPrice({feedAddress}) {
    const [currentPrice, setCurrentPrice] = useState('');

    

   const feedABI  = [{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}] as const

  


    const {data: result} =  useReadContract({
        abi: feedABI,
        address: feedAddress as `0x${string}`,
        functionName: 'latestAnswer',
        args: [],
        chainId: arbitrum.id,
      })


      useEffect(() => {
        console.log("coddio", result)
        if (result) {
            setCurrentPrice(result.toString());
        }
    }, [result]);


  
    return (
        <>
                                        <span className="ml-4">Current price: <br /> {currentPrice}</span>            
        </>

    );
}