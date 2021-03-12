const address = require("./addresses.json");
const SCInteraction = require("./scInteraction.js");

// Sending Settings
settings = {
    from: address.account[0],
    gasLimit: 6721975,
    gasPrice: web3.utils.toWei('20000000000', 'wei'),
};

async function main() {
    let create = await SCInteraction.createNewNFT();
    let id = create.events.TransferSingle.returnValues._id;
    console.log("Token ID", id);
    console.log(create.events.TransferSingle.returnValues._value);

    let mint = await SCInteraction.mintNewNFT(id, [address.myNFTAuction], ["56"]);

    let balance = await SCInteraction.balanceNFT([id], [address.myNFTAuction]);
    console.log("Your Balance", balance);
}

main();