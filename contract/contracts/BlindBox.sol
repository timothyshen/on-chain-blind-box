// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

interface IIPPYNFT {
    function mint(address to, uint256 tokenId) external;
}

contract BlindBox is ERC1155 {
    IIPPYNFT public ippyNFT;

    // NFT IDs for the 7 different NFTs
    uint256 public constant HIDDEN_NFT_ID = 0; // Ultra rare hidden NFT
    uint256 public constant STANDARD_NFT_1 = 1;
    uint256 public constant STANDARD_NFT_2 = 2;
    uint256 public constant STANDARD_NFT_3 = 3;
    uint256 public constant STANDARD_NFT_4 = 4;
    uint256 public constant STANDARD_NFT_5 = 5;
    uint256 public constant STANDARD_NFT_6 = 6;

    // Probability constants
    uint256 private constant TOTAL_RANGE = 10_000_000; // 10 million for precise probability
    uint256 private constant HIDDEN_NFT_THRESHOLD = 1; // 1 in 10,000,000 = 0.0001%
    uint256 private constant STANDARD_NFT_RANGE =
        (TOTAL_RANGE - HIDDEN_NFT_THRESHOLD) / 6; // ~1,666,666 each

    constructor(address _ippyNFT) ERC1155("") {
        ippyNFT = IIPPYNFT(_ippyNFT);
    }

    function mint(address to, uint256 tokenId, uint256 amount) public {
        _mint(to, tokenId, amount, "");
    }

    function burn(address from, uint256 tokenId, uint256 amount) public {
        _burn(from, tokenId, amount);

        // Generate random number for NFT selection
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao, // More random than block.difficulty in newer versions
                    msg.sender,
                    block.number,
                    tx.gasprice
                )
            )
        );

        uint256 randomIndex = randomNumber % TOTAL_RANGE;
        uint256 selectedNFTId = _selectNFTById(randomIndex);

        // Mint the selected NFT
        ippyNFT.mint(from, selectedNFTId);
    }

    function _selectNFTById(
        uint256 randomIndex
    ) private pure returns (uint256) {
        // Hidden NFT: 0.0001% chance (1 in 10,000,000)
        if (randomIndex < HIDDEN_NFT_THRESHOLD) {
            return HIDDEN_NFT_ID;
        }

        // Standard NFTs: distribute remaining range equally
        uint256 adjustedIndex = randomIndex - HIDDEN_NFT_THRESHOLD;
        uint256 nftGroup = adjustedIndex / STANDARD_NFT_RANGE;

        // Ensure we don't go out of bounds (safety check)
        if (nftGroup >= 6) {
            nftGroup = 5; // Assign to the last standard NFT
        }

        return STANDARD_NFT_1 + nftGroup; // Returns 1-6 for standard NFTs
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string(
                abi.encodePacked("https://api.blindbox.com/token/", tokenId)
            );
    }

    // View function to check probability distribution (for testing)
    function getProbabilityInfo()
        public
        pure
        returns (
            uint256 totalRange,
            uint256 hiddenThreshold,
            uint256 standardRange,
            uint256 hiddenProbabilityBasisPoints // in basis points (1 bp = 0.01%)
        )
    {
        return (
            TOTAL_RANGE,
            HIDDEN_NFT_THRESHOLD,
            STANDARD_NFT_RANGE,
            (HIDDEN_NFT_THRESHOLD * 10000) / TOTAL_RANGE // Convert to basis points
        );
    }
}
