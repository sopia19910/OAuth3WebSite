// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./IOauthNamingService.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OauthNamingService is IOauthNamingService, Ownable {

    mapping(bytes32 => address) public emailHashToZKAccount;
    address public zkAccountFactory;

    event OauthNamingServiceCreated(
        address indexed zkAccount
    );

    modifier onlyZKAccountFactory() {
        require(msg.sender == zkAccountFactory, "Only ZKAccountFactory can call this function");
        _;
    }

    constructor() Ownable(msg.sender) {

    }

    function setZKAccountFactory(address _zkAccountFactory) external onlyOwner {
        require(zkAccountFactory == address(0), "Factory already set");
        zkAccountFactory = _zkAccountFactory;
    }

    function registerEmail(
        string calldata email,
        address zkAccount
    ) external override onlyZKAccountFactory {
        bytes32 emailHash = keccak256(abi.encodePacked(email));
        emailHashToZKAccount[emailHash] = zkAccount;
        emit OauthNamingServiceCreated(zkAccount);
    }

    function getZkAccountByEmail(
        bytes32 emailHash
    ) external view override returns (address) {
        return emailHashToZKAccount[emailHash];
    }
}