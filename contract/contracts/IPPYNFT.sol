// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IPPYNFT is ERC721, Ownable {
    // Address of the BlindBox contract that can mint NFTs
    address public blindBoxContract;

    // Base URIs for different NFT types
    string private baseURIStandard = "https://api.ippy.com/standard/";
    string private baseURIHidden = "https://api.ippy.com/hidden/";

    // NFT type constants (matching BlindBox contract)
    uint256 public constant HIDDEN_NFT_ID = 0;

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
        _mint(to, tokenId);
    }

    /**
     * @dev Override tokenURI to provide different metadata for different NFT types
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        if (tokenId == HIDDEN_NFT_ID) {
            // Hidden NFT gets special metadata
            return string(abi.encodePacked(baseURIHidden, _toString(tokenId)));
        } else {
            // Standard NFTs (IDs 1-6)
            return
                string(abi.encodePacked(baseURIStandard, _toString(tokenId)));
        }
    }

    /**
     * @dev Update base URI for standard NFTs (only owner)
     */
    function setBaseURIStandard(string calldata _baseURI) external onlyOwner {
        baseURIStandard = _baseURI;
    }

    /**
     * @dev Update base URI for hidden NFTs (only owner)
     */
    function setBaseURIHidden(string calldata _baseURI) external onlyOwner {
        baseURIHidden = _baseURI;
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
}
