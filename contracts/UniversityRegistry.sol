// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UniversityRegistry is AccessControl {
    bytes32 public constant ROOT_ADMIN = keccak256("ROOT_ADMIN");
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");

    struct University {
        address addr;
        string metadataURI;
        bool active;
    }

    mapping(address => University) public universities;
    event UniversityRegistered(address indexed univ, string metadataURI);
    event UniversityStatusUpdated(address indexed univ, bool active);

    constructor(address root) {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
        _setupRole(ROOT_ADMIN, root);
    }

    function registerUniversity(address univAddr, string calldata metadataURI) external onlyRole(ROOT_ADMIN) {
        universities[univAddr] = University({addr: univAddr, metadataURI: metadataURI, active: true});
        _grantRole(UNIVERSITY_ROLE, univAddr);
        emit UniversityRegistered(univAddr, metadataURI);
    }

    function updateStatus(address univAddr, bool active) external onlyRole(ROOT_ADMIN) {
        universities[univAddr].active = active;
        emit UniversityStatusUpdated(univAddr, active);
    }

    function getUniversity(address univAddr) external view returns (bool active, string memory metadataURI) {
        University memory u = universities[univAddr];
        return (u.active, u.metadataURI);
    }
}
