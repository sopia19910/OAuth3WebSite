// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

interface IOauthNamingService {

    function registerEmail(
        string calldata email,
        address zkAccount
    ) external;

    function getZkAccountByEmail(
        bytes32 emailHash
    ) external view returns (address);
}
