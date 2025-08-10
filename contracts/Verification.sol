// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICertificateNFT {
    function isValid(uint256 tokenId) external view returns (bool);
}

contract Verification {
    ICertificateNFT public nft;

    constructor(address nftAddress) {
        nft = ICertificateNFT(nftAddress);
    }

    function verifyCertificate(uint256 tokenId) public view returns (bool) {
        return nft.isValid(tokenId);
    }
}
