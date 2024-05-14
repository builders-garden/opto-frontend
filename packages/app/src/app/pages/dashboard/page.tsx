
import Ethereum from '@/assets/icons/ethereum.png'
import React, { useEffect, useState } from 'react'
import equities from '@/utils/list-equities'
import gasCosts from '@/utils/list-gas'
import misc from '@/utils/list-misc'
import Owned from '@/components/Owned'
import Writings from '@/components/Writings'
export default function Dashboard() {

    return (


        <>

            <div className="bg-primary items-center overflow-x-auto mt-20 shadow-md sm:rounded-lg">


                <div className="relative p-2 overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="form-control w-34 absolute right-6">
                        <label className="label cursor-pointer">
                            <span className="label-text text-xs">Show expired &nbsp;</span>
                            <input type="checkbox" className="toggle toggle-xs" />
                        </label>
                    </div>
                    <div role="tablist" className="tabs tabs-lifted">

                        <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100" aria-label="Owned" defaultChecked />
                        <div role="tabpanel" className="tab-content bg-primary border-base-300  p-6">

                            <Owned />


                        </div>
                        <input type="radio" name="my_tabs_2" role="tab" className="tab bg-slate-100" aria-label="Written" />
                        <div role="tabpanel" className="tab-content bg-primary border-base-300  p-6">
                            <Writings />
                        </div>


                    </div>
                </div>
            </div>
        </>
    );
};


