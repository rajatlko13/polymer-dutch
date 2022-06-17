// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    }

    function mintNFT(address to, uint tokenId) public {
        _safeMint(to, tokenId);
    }
}