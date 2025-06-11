// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IPPYNFT is ERC721, ERC721Enumerable, Ownable {
    // Address of the BlindBox contract that can mint NFTs
    address public blindBoxContract;

    // Base URIs for different NFT types
    string private baseURIStandard = "https://api.ippy.com/standard/";
    string private baseURIHidden = "https://api.ippy.com/hidden/";

    // NFT type constants (matching BlindBox contract)
    uint256 public constant HIDDEN_NFT_ID = 0;

    // Tracking for statistics
    mapping(uint256 => uint256) public nftTypeCounts; // tokenId => count minted
    mapping(address => mapping(uint256 => uint256)) public userNFTTypeCounts; // user => tokenId => count

    // Events for frontend tracking
    event NFTMinted(address indexed to, uint256 indexed tokenId, bool isHidden);
    event BaseURIUpdated(string newStandardURI, string newHiddenURI);

    modifier onlyBlindBox() {
        require(msg.sender == blindBoxContract, "Only BlindBox can mint");
        _;
    }

    constructor() ERC721("IPPYNFT", "IPPY") Ownable(msg.sender) {}

    /**
     * @dev Set the BlindBox contract address (only owner can call)
     */
    function setBlindBoxContract(address _blindBoxContract) external onlyOwner {
        blindBoxContract = _blindBoxContract;
    }

    /**
     * @dev Mint function called by BlindBox contract
     */
    function mint(address to, uint256 tokenId) external onlyBlindBox {
        uint256 newTokenId = totalSupply(); // Use sequential token IDs
        _mint(to, newTokenId);

        // Track statistics
        nftTypeCounts[tokenId]++;
        userNFTTypeCounts[to][tokenId]++;

        bool isHidden = tokenId == HIDDEN_NFT_ID;
        emit NFTMinted(to, newTokenId, isHidden);
    }

    /**
     * @dev Override tokenURI to provide different metadata for different NFT types
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        uint256 nftType = _getNFTType(tokenId);

        if (nftType == HIDDEN_NFT_ID) {
            // Hidden NFT gets special metadata
            return string(abi.encodePacked(baseURIHidden, _toString(tokenId)));
        } else {
            // Standard NFTs (IDs 1-6)
            return
                string(abi.encodePacked(baseURIStandard, _toString(tokenId)));
        }
    }

    /**
     * @dev Get the NFT type (0-6) based on the token ID
     */
    function _getNFTType(uint256 tokenId) internal pure returns (uint256) {
        // This is a simplified mapping - you might want to store the actual type
        // For now, we'll derive it from the token ID pattern
        return (tokenId % 7);
    }

    /**
     * @dev Get all NFTs owned by a user with their types
     */
    function getUserNFTs(
        address user
    )
        external
        view
        returns (
            uint256[] memory tokenIds,
            uint256[] memory nftTypes,
            string[] memory tokenURIs
        )
    {
        uint256 balance = balanceOf(user);
        tokenIds = new uint256[](balance);
        nftTypes = new uint256[](balance);
        tokenURIs = new string[](balance);

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            tokenIds[i] = tokenId;
            nftTypes[i] = _getNFTType(tokenId);
            tokenURIs[i] = tokenURI(tokenId);
        }

        return (tokenIds, nftTypes, tokenURIs);
    }

    /**
     * @dev Get user's NFT counts by type
     */
    function getUserNFTTypeCounts(
        address user
    ) external view returns (uint256[] memory types, uint256[] memory counts) {
        types = new uint256[](7); // 0-6 types
        counts = new uint256[](7);

        for (uint256 i = 0; i < 7; i++) {
            types[i] = i;
            counts[i] = userNFTTypeCounts[user][i];
        }

        return (types, counts);
    }

    /**
     * @dev Get global statistics for all NFT types
     */
    function getGlobalNFTStats()
        external
        view
        returns (
            uint256[] memory types,
            uint256[] memory counts,
            uint256 totalMinted
        )
    {
        types = new uint256[](7);
        counts = new uint256[](7);

        for (uint256 i = 0; i < 7; i++) {
            types[i] = i;
            counts[i] = nftTypeCounts[i];
        }

        return (types, counts, totalSupply());
    }

    /**
     * @dev Check if user owns a hidden NFT
     */
    function userOwnsHiddenNFT(address user) external view returns (bool) {
        return userNFTTypeCounts[user][HIDDEN_NFT_ID] > 0;
    }

    /**
     * @dev Update base URI for standard NFTs (only owner)
     */
    function setBaseURIStandard(string calldata _baseURI) external onlyOwner {
        baseURIStandard = _baseURI;
        emit BaseURIUpdated(_baseURI, baseURIHidden);
    }

    /**
     * @dev Update base URI for hidden NFTs (only owner)
     */
    function setBaseURIHidden(string calldata _baseURI) external onlyOwner {
        baseURIHidden = _baseURI;
        emit BaseURIUpdated(baseURIStandard, _baseURI);
    }

    /**
     * @dev Get base URIs (view function)
     */
    function getBaseURIs()
        external
        view
        returns (string memory standard, string memory hidden)
    {
        return (baseURIStandard, baseURIHidden);
    }

    /**
     * @dev Convert uint256 to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Required overrides for multiple inheritance
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
