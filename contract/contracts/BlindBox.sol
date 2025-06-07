// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BlindBox is ERC1155 {
    constructor() ERC1155("") {}

    function mint(address to, uint256 tokenId, uint256 amount) public {
        _mint(to, tokenId, amount, "");
    }

    function burn(address from, uint256 tokenId, uint256 amount) public {
        _burn(from, tokenId, amount);
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        );
        uint256 randomIndex = randomNumber % 100;
        if (randomIndex < 10) {
            IPPYNFT(ippyNFT).mint(from, tokenId);
        }
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string(
                abi.encodePacked("https://api.blindbox.com/token/", tokenId)
            );
    }
}
