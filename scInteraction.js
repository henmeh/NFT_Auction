//Contract ABIs
const nftAuctionABI = require("./build/contracts/MyNFTAuction.json");
const nftTokenABI = require("./build/contracts/NFTToken.json");
const address = require("./addresses.json");
//const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');

// Connecting to the Ethereum Blockchain 
const web3 = new Web3("HTTP://192.168.178.20:7545");
//const web3 = new Web3(new HDWalletProvider("0x1eb8c810ad16b73f69b0bd9a169f938d4c3f88d039d3b1ad3d8c0ebe5245be57", "https://kovan.infura.io/v3/134eb24f9b9d410baa2acac76d2a7be3"));

// Connecting to SmartContract
const nftAuctionContract = new web3.eth.Contract(nftAuctionABI.abi, address.myNFTAuction);
const nftTokenContract = new web3.eth.Contract(nftTokenABI.abi, address.nftToken);

module.exports = {
    createNewNFT: async function (sendSettings) {
        try {
            const nftID = await nftTokenContract.methods.create("0", "").send(sendSettings);
            return nftID;
        } catch (error) { console.log(error); }
    },

    mintNewNFT: async function (_tokenId, _receiver, _quantities, sendSettings) {
        try {
            const mint = await nftTokenContract.methods.mint(_tokenId, _receiver, _quantities).send(sendSettings);
            return mint;
        } catch (error) { console.log(error); }
    },

    balanceNFT: async function (_tokenId, _owner) {
        try {
            const balance = await nftTokenContract.methods.balanceOfBatch(_owner, _tokenId).call();
            return balance;
        } catch (error) { console.log(error); }
    },

    startNewAuction: async function(_tokenId, _duration, sendSettings) {
        try {
            const auction = await nftAuctionContract.methods.startAuction(_tokenId, _duration).send(sendSettings);
            return auction;
        } catch (error) { console.log(error); }
    },

    bitForNFT: async function(_tokenId, _bit, sendSettings) {
        try {
            const bit = await nftAuctionContract.methods.bit(_tokenId, _bit).send(sendSettings);
            return bit;
        } catch (error) { console.log(error); }
    },

    sellNFT: async function(_tokenId, sendSettings) {
        try {
            const sell = await nftAuctionContract.methods.sellItem(_tokenId).send(sendSettings);
            return sell;
        } catch (error) { console.log(error); }
    },

    withdraw: async function(sendSettings) {
        try {
            const withdraw = await nftAuctionContract.methods.withdraw().send(sendSettings);
            return withdraw;
        } catch (error) { console.log(error); }
    },

    getTokenList: async function() {
        try {
            const tokenList = await nftAuctionContract.methods.getTokenList().call();
            return tokenList;
        } catch (error) { console.log(error); }
    },

    getTokenAmount: async function(_tokenId) {
        try {
            const tokenAmount = await nftAuctionContract.methods.getTokenAmount(_tokenId).call();
            return tokenAmount;
        } catch (error) { console.log(error); }
    }
}
