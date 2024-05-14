import amazon from "@/assets/icons/assetlogos/amazon.png";
import apple from "@/assets/icons/assetlogos/apple.png";
import coinbase from "@/assets/icons/assetlogos/coinbase.png";
import google from "@/assets/icons/assetlogos/google.png";
import microsoft from "@/assets/icons/assetlogos/microsoft.png";
import nvidia from "@/assets/icons/assetlogos/nvidia.png";
import tesla from  "@/assets/icons/assetlogos/tesla.png";


interface Option {
    pair: string;
    address: string;
    assetName: string;
    assetType: string;
    marketHours: string; // Always include this default as Ongoing
    imageUrl: string; // URL to the asset image
}

const equities: Option[] = [
    {
        pair: "AAPL / USD",
        address: "0x8d0CC5f38f9E802475f2CFf4F9fc7000C2E1557c",
        assetName: "Apple",
        assetType: "Equities",
        marketHours: "US_Equities",
        imageUrl: apple.src
    },
    {
        pair: "AMZN / USD",
        address: "0xd6a77691f071E98Df7217BED98f38ae6d2313EBA",
        assetName: "Amazon",
        assetType: "Equities",
        marketHours: "US_Equities",
        imageUrl: amazon.src
    },
    {
        pair: "COIN / USD",
        address: "0x950DC95D4E537A14283059bADC2734977C454498",
        assetName: "Coinbase",
        assetType: "Equities",
        marketHours: "Ongoing",
        imageUrl: coinbase.src
    },
    {
        pair: "GOOGL / USD",
        address: "0x1D1a83331e9D255EB1Aaf75026B60dFD00A252ba",
        assetName: "Alphabet",
        assetType: "Equities",
        marketHours: "US_Equities",
        imageUrl: google.src
    },
    {
        pair: "MSFT / USD",
        address: "0xDde33fb9F21739602806580bdd73BAd831DcA867",
        assetName: "Microsoft",
        assetType: "Equities",
        marketHours: "US_Equities",
        imageUrl:  microsoft.src
    },
    {
        pair: "NVDA / USD",
        address: "0x4881A4418b5F2460B21d6F08CD5aA0678a7f262F",
        assetName: "Nvidia",
        assetType: "Equities",
        marketHours: "Ongoing",
        imageUrl: nvidia.src
    },
    {
        pair: "TSLA / USD",
        address: "0x3609baAa0a9b1f0FE4d6CC01884585d0e191C3E3",
        assetName: "Tesla",
        assetType: "Equities",
        marketHours: "US_Equities",
        imageUrl: tesla.src
    }
];

export default equities;
