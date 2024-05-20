import { Chain, hardhat, polygonAmoy, arbitrum, sepolia } from 'viem/chains'

let chains = [polygonAmoy, arbitrum, sepolia] as [Chain, ...Chain[]]

if (process.env.NODE_ENV !== 'production') chains.push(sepolia, hardhat)

export const ETH_CHAINS = chains

export const NETWORK_COLORS = {
  polygonAmoy: {
    color: 'red',
    bgVariant: 'bg-red-600',
  },
  other: {
    color: "red",
    bgVariant: 'bg-red-600',
  },
}

export function GetNetworkColor(chain?: string, type: 'color' | 'bgVariant' = 'color') {
  chain = chain?.toLocaleLowerCase()
  if (chain === 'polygonAmoy' || chain === 'arbitrum' || chain === 'homestead') return NETWORK_COLORS.polygonAmoy[type]


  return NETWORK_COLORS.other[type]
}
