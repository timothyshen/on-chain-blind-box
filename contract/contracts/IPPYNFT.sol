// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract IPPYNFT is ERC721 {
    constructor() ERC721("IPPYNFT", "IPPY") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked("https://api.ippy.com/token/", tokenId));
    }
}
