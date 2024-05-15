

import Ethereum from '@/assets/icons/ethereum.png'
import React, { useEffect, useState } from 'react'
import equities from '@/utils/list-equities'
import gasCosts from '@/utils/list-gas'
import misc from '@/utils/list-misc'
import AssetLists from '@/components/AssetLists'
export default function Explore() {

    return (
        <>
            <div className="relative overflow-x-auto mt-20 shadow-md sm:rounded-lg">
            <AssetLists/>
            </div>
        </>
    );
};


