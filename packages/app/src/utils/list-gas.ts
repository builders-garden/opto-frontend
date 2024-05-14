import gaseth from "@/assets/icons/assetlogos/gas-eth.png";
import gasavax from "@/assets/icons/assetlogos/gas-avax.png";
import gasbnb from "@/assets/icons/assetlogos/gas-bnb.png";
import blobeth from "@/assets/icons/assetlogos/blob-eth.png";


interface Option {
    chain: string;
    assetName: string;
    assetType: string;
    marketHours: string; // Always include this default as Ongoing
    imageUrl: string; // URL to the asset image
}

const gasCosts : Option[] = [
    {
        chain: "Ethereum",
        assetName: "Gas-Eth",
        assetType: "Base fee",
        marketHours: "Ongoing",
        imageUrl: gaseth.src
    },
    {
        chain: "Ethereum",
        assetName: "Blob-Eth",
        assetType: "Blob base fee",
        marketHours: "Ongoing",
        imageUrl: blobeth.src
    },
    {
        chain: "Avalanche",
        assetName: "Gas-Avax",
        assetType: "Base fee",
        marketHours: "Ongoing",
        imageUrl: gasavax.src
    },
    {
        chain: "Binance Smart Chain",
        assetName: "Gas-Bnb",
        assetType: "Base fee",
        marketHours: "Ongoing",
        imageUrl: gasbnb.src
    }
];

export default gasCosts;
