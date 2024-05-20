import gaseth from "@/assets/icons/assetlogos/gas-eth.png";
import gasavax from "@/assets/icons/assetlogos/gas-avax.png";
import gasbnb from "@/assets/icons/assetlogos/gas-bnb.png";
import blobeth from "@/assets/icons/assetlogos/blob-eth.png";


interface Option {
    chain: string;
    address: string;
    assetName: string;
    assetType: string;
    marketHours: string; // Always include this default as Ongoing
    imageUrl: string; // URL to the asset image
}

const gasCosts : Option[] = [
    {
        chain: "Ethereum",
        address: "-",
        assetName: "gaseth",
        assetType: "Base fee",
        marketHours: "Ongoing",
        imageUrl: gaseth.src
    },
    {
        chain: "Ethereum",
        address: "-",
        assetName: "blobeth",
        assetType: "Blob base fee",
        marketHours: "Ongoing",
        imageUrl: blobeth.src
    },
    {
        chain: "Avalanche",
        address: "-",
        assetName: "gasavax",
        assetType: "Base fee",
        marketHours: "Ongoing",
        imageUrl: gasavax.src
    },
    {
        chain: "Binance Smart Chain",
        address: "-",
        assetName: "gasbnb",
        assetType: "Base fee",
        marketHours: "Ongoing",
        imageUrl: gasbnb.src
    }
];

export default gasCosts;
