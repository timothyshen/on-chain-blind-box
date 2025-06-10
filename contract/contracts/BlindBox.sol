// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IIPPYNFT {
    function mint(address to, uint256 tokenId) external;
}

contract BlindBox is ERC1155, Ownable, ReentrancyGuard {
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

    // Pricing and limits
    uint256 public boxPrice = 0.01 ether; // Price per blind box
    uint256 public maxBoxesPerTx = 10; // Max boxes per transaction
    uint256 public maxTotalSupply = 100000; // Max total boxes
    uint256 public currentSupply = 0; // Current minted boxes

    // Events for frontend tracking
    event BlindBoxPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );
    event BlindBoxOpened(
        address indexed opener,
        uint256 boxTokenId,
        uint256 receivedNFTId,
        bool isHidden
    );
    event PriceUpdated(uint256 newPrice);
    event NFTMinted(address indexed recipient, uint256 nftId);

    constructor(
        address _ippyNFT
    )
        ERC1155("https://api.blindbox.com/metadata/{id}.json")
        Ownable(msg.sender)
    {
        ippyNFT = IIPPYNFT(_ippyNFT);
    }

    // Purchase blind boxes
    function purchaseBoxes(uint256 amount) external payable nonReentrant {
        require(amount > 0 && amount <= maxBoxesPerTx, "Invalid amount");
        require(currentSupply + amount <= maxTotalSupply, "Exceeds max supply");
        require(msg.value >= boxPrice * amount, "Insufficient payment");

        // Mint boxes to buyer (using token ID 1 for all blind boxes)
        _mint(msg.sender, 1, amount, "");
        currentSupply += amount;

        emit BlindBoxPurchased(msg.sender, amount, boxPrice * amount);

        // Refund excess payment
        if (msg.value > boxPrice * amount) {
            payable(msg.sender).transfer(msg.value - (boxPrice * amount));
        }
    }

    // Open blind boxes (previous burn function renamed for clarity)
    function openBox(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender, 1) >= amount, "Insufficient boxes");

        _burn(msg.sender, 1, amount);

        // Open each box individually

        uint256 selectedNFTId = _generateRandomNFT(1);
        ippyNFT.mint(msg.sender, selectedNFTId);

        bool isHidden = selectedNFTId == HIDDEN_NFT_ID;
        emit BlindBoxOpened(msg.sender, 1, selectedNFTId, isHidden);
        emit NFTMinted(msg.sender, selectedNFTId);
    }

    function _generateRandomNFT(uint256 nonce) private view returns (uint256) {
        // Generate random number for NFT selection
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    block.number,
                    tx.gasprice,
                    nonce // Add nonce for multiple boxes in same tx
                )
            )
        );

        uint256 randomIndex = randomNumber % TOTAL_RANGE;
        return _selectNFTById(randomIndex);
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

    // Admin functions
    function setBoxPrice(uint256 _newPrice) external onlyOwner {
        boxPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    function setMaxBoxesPerTx(uint256 _maxBoxes) external onlyOwner {
        maxBoxesPerTx = _maxBoxes;
    }

    function setMaxTotalSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply >= currentSupply, "Cannot set below current supply");
        maxTotalSupply = _maxSupply;
    }

    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Frontend helper functions
    function getUserBoxBalance(address user) external view returns (uint256) {
        return balanceOf(user, 1);
    }

    function getContractInfo()
        external
        view
        returns (
            uint256 price,
            uint256 maxPerTx,
            uint256 totalSupply,
            uint256 currentSupplyCount,
            uint256 remainingBoxes
        )
    {
        return (
            boxPrice,
            maxBoxesPerTx,
            maxTotalSupply,
            currentSupply,
            maxTotalSupply - currentSupply
        );
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

    // Legacy function for backwards compatibility
    function mint(address to, uint256 tokenId) external onlyOwner {
        _mint(to, tokenId, 1, "");
    }
}
