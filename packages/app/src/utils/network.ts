import { avalancheFuji } from 'viem/chains'
import { Chain, hardhat, sepolia } from 'viem/chains'

let chains = [avalancheFuji] as [Chain, ...Chain[]]

if (process.env.NODE_ENV !== 'production') chains.push(sepolia, hardhat)

export const ETH_CHAINS = chains

export const NETWORK_COLORS = {
  avalancheFuji: {
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
  if (chain === 'avalancheFuji' || chain === 'mainnet' || chain === 'homestead') return NETWORK_COLORS.avalancheFuji[type]


  return NETWORK_COLORS.other[type]
}
