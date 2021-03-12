pragma solidity 0.5.0;

import "../erc-1155/contracts/ERC1155.sol";
import "../erc-1155/contracts/ERC1155Mintable.sol";

contract NFTToken is ERC1155, ERC1155Mintable {
    constructor() public {

    }
}