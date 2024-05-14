import gold from "@/assets/icons/assetlogos/gold.png";
import silver from "@/assets/icons/assetlogos/silver.png";  



interface Misc {
    pair: string;
    address: string;
    assetName: string;
    assetType: string;
    marketHours: string; // Always include this default as Ongoing
    imageUrl: string; // URL to the asset image
} 

const misc: Misc[] = [
    {
        pair: "XAG / USD",
        address: "0xC56765f04B248394CF1619D20dB8082Edbfa75b1",
        assetName: "Silver",
        assetType: "Commodities",
        marketHours: "Precious_Metals",
        imageUrl: silver.src
    },
    {
        pair: "XAU / USD",
        address: "0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c",
        assetName: "Gold",
        assetType: "Commodities",
        marketHours: "Precious_Metals",
        imageUrl: gold.src
    }
];
export default misc;