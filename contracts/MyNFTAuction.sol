pragma solidity 0.5.0;

import "../erc-1155/contracts/IERC1155.sol";
import "../erc-1155/contracts/ERC1155Mintable.sol";


contract MyNFTAuction is ERC1155Mintable {

    struct Auction {
        bool hasStarted;
        uint ending;
        uint highestBit;
        address highestBitter;
        address payable auctionOwner;
    }
    
    mapping(uint => Auction) auctionList;
    mapping(uint => uint) tokenAmountTracking;
    uint[] tokenList;
    IERC1155 private token;
    address public owner;
    
    constructor(address _token) public {
        require(_token != address(0));
        token = IERC1155(_token);
        owner = msg.sender;
    }

    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4) {
        tokenList.push(_id);
        tokenAmountTracking[_id] = _value;
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4) {
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }

    function startAuction(uint _tokenId, uint _duration) public {
        require(msg.sender == creators[_tokenId], "Only creator can start the Auction");
        require(auctionList[_tokenId].hasStarted == false, "Auction already started");
        
        auctionList[_tokenId].hasStarted = true;
        auctionList[_tokenId].ending = now + _duration;
        auctionList[_tokenId].auctionOwner = msg.sender;
    }
    
    function bit(uint _tokenId, uint _bit) public {
        require(auctionList[_tokenId].hasStarted == true, "Auction has not started yet");
        require(_bit >= auctionList[_tokenId].highestBit, "You need to make an higher offer");
        require(now < auctionList[_tokenId].ending, "Auction already finished");
     
        auctionList[_tokenId].highestBit = _bit;
        auctionList[_tokenId].highestBitter = msg.sender;
    }
    
    function sellItem(uint _tokenId) public payable {
        require(msg.sender == auctionList[_tokenId].highestBitter, "You did not won the auction");
        require(msg.value == auctionList[_tokenId].highestBit, "Please send the correct bitting amount");
        
        tokenAmountTracking[_tokenId] -= 1;
        token.safeTransferFrom(address(this), msg.sender, _tokenId, 1, "");
        auctionList[_tokenId].auctionOwner.transfer(msg.value * 9 / 10);
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only the contract owner can withdraw");
        
        msg.sender.transfer(address(this).balance);
    }

    function() external payable {
        msg.sender.transfer(msg.value);
    }

//--------------------Some Getter Functions----------------------------------------------------------------

    function getTokenList() public returns(uint[] memory) {
        return tokenList;
    }

    function getTokenAmount(uint _tokenId) public returns(uint) {
        return tokenAmountTracking[_tokenId];
    }
}