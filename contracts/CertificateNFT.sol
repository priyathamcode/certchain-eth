// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateNFT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 private _tokenIdCounter;
    mapping(uint256 => bool) private _validCertificates;

    constructor() ERC721("CertificateNFT", "CERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mintCertificate(address recipient) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(recipient, tokenId);
        _validCertificates[tokenId] = true;
    }

    function revokeCertificate(uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _validCertificates[tokenId] = false;
    }

    function isValid(uint256 tokenId) public view returns (bool) {
        return _validCertificates[tokenId];
    }

    function grantMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
    }

    // Required override for AccessControl
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
