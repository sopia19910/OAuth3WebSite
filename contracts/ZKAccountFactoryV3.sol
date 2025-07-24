
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./ZKAccountV3.sol";
import {IOauthNamingService} from "./IOauthNamingService.sol";

contract ZKAccountFactoryV3 {
    address public immutable zkAccountImplementation;
    address public immutable zkVerifier;
    address public immutable oauthNamingService;

    mapping(address => address[]) public userAccounts;
    mapping(address => bool) public isZKAccount;

    event ZKAccountCreated(
        address indexed owner,
        address indexed zkAccount,
        uint256 emailHash,
        uint256 domainHash,
        bool requiresZKProof
    );

    constructor(address _zkAccountImplementation, address _zkVerifier, address _oauthNamingService) {
        require(_zkAccountImplementation != address(0), "Invalid implementation");
        require(_zkVerifier != address(0), "Invalid verifier");
        require(_oauthNamingService != address(0), "Invalid OAuth naming service");

        zkAccountImplementation = _zkAccountImplementation;
        zkVerifier = _zkVerifier;
        oauthNamingService = _oauthNamingService;
    }

    function createZKAccount(
        bool _requiresZKProof,
        uint256 _authorizedEmailHash,
        uint256 _authorizedDomainHash,
        bytes32 _salt,
        string calldata _email
    ) external returns (address) {
        require(_authorizedEmailHash > 0, "Invalid email hash");
        require(_authorizedDomainHash > 0, "Invalid domain hash");
        require(bytes(_email).length > 0, "Invalid Gmail address");

        // Create deterministic address
        bytes memory initData = abi.encodeWithSelector(
            ZKAccountV3.initialize.selector,
            msg.sender,
            zkVerifier,
            _requiresZKProof,
            _authorizedEmailHash,
            _authorizedDomainHash
        );

        bytes32 salt = keccak256(abi.encodePacked(msg.sender, _salt));

        address zkAccount = address(new ERC1967Proxy{salt: salt}(
            zkAccountImplementation,
            initData
        ));

        userAccounts[msg.sender].push(zkAccount);
        isZKAccount[zkAccount] = true;
        IOauthNamingService(oauthNamingService).registerEmail(
            _email,
            zkAccount
        );

        emit ZKAccountCreated(
            msg.sender,
            zkAccount,
            _authorizedEmailHash,
            _authorizedDomainHash,
            _requiresZKProof
        );

        return zkAccount;
    }

    function getUserAccounts(address user) external view returns (address[] memory) {
        return userAccounts[user];
    }

    function getAccountCount(address user) external view returns (uint256) {
        return userAccounts[user].length;
    }

    function predictZKAccountAddress(
        address owner,
        bytes32 _salt
    ) external view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(owner, _salt));

        bytes memory bytecode = abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(zkAccountImplementation, "")
        );

        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
        );

        return address(uint160(uint256(hash)));
    }
}
