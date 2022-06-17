import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DutchAuction } from "../typechain/DutchAuction";
import { DutchAuction__factory } from "../typechain/factories/DutchAuction__factory";
import { NFT } from "../typechain/NFT";
import { NFT__factory } from "../typechain/factories/NFT__factory";
import { timeTraveller } from '../scripts/helper';

describe.only("02_DutchAuction", function () {

    let deployer: SignerWithAddress,
        buyer: SignerWithAddress,
        DutchAuctionFactory: DutchAuction__factory,
        dutchAuction: DutchAuction,
        NFTFactory: NFT__factory,
        nft: NFT,
        NFT_NAME = "Marvels",
        NFT_SYMBOL = "MVL",
        NFT_ID = 1,
        STARTING_PRICE = 100000000,
        DISCOUNT_RATE = 1;


    before(async () => {
        [deployer, buyer] = await ethers.getSigners();

        // deploying the NFT contract
        NFTFactory = await ethers.getContractFactory('NFT', deployer) as NFT__factory;
        nft = await NFTFactory.deploy(NFT_NAME, NFT_SYMBOL);
        // minting the NFT to be auctioned
        const tx = await nft.connect(deployer).mintNFT(deployer.address, NFT_ID);

        // deploying the DutchAuction contract
        DutchAuctionFactory = await ethers.getContractFactory('DutchAuction', deployer);
        dutchAuction = await DutchAuctionFactory.deploy(STARTING_PRICE, DISCOUNT_RATE, nft.address, NFT_ID);
        await dutchAuction.deployed();

        // approve the dutchAuction contract to transfer token with tokenId = 1
        await nft.connect(deployer).approve(dutchAuction.address, NFT_ID);
    });

    it("success on buying before the auction ends", async function() {
        const price = await dutchAuction.getPrice();
        const tx = await dutchAuction.connect(buyer).buy({value: price});
        await tx.wait();

        const owner = await nft.ownerOf(NFT_ID);
        expect(owner).to.be.eq(buyer.address);
    })

});
