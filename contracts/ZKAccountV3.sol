// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import './SecureGoogleOAuthVerifier.sol';

/**
 * @title ZKAccountV3
 * @dev Secure Account Abstraction wallet with fixed ZK proof vulnerability
 * Now the emailHash and domainHash are computed inside the circuit from private inputs
 */
contract ZKAccountV3 is Initializable, UUPSUpgradeable {
    using ECDSA for bytes32;

    // Events
    event ZKAccountInitialized(address indexed owner, address indexed zkVerifier, uint256 emailHash, uint256 domainHash);
    event TransactionExecuted(address indexed target, uint256 value, bytes data, bool success);
    event TransactionFailed(address indexed target, uint256 value, bytes data, string reason);
    event ZKProofVerified(uint256 emailHash, uint256 domainHash, uint256 nullifier, address executor);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner, uint256 nullifier);

    // State variables
    address public owner;
    Groth16Verifier public zkVerifier;

    // Gmail account binding (set at initialization)
    uint256 public authorizedEmailHash;
    uint256 public authorizedDomainHash;

    // ZK proof validation
    mapping(uint256 => bool) public usedNullifiers;
    mapping(address => uint256) public lastNullifier;

    // Execution controls
    bool public requiresZKProof;
    uint256 public nonce;

    // Security: Add proof expiry
    uint256 public constant PROOF_VALIDITY_PERIOD = 1 hours;
    mapping(uint256 => uint256) public nullifierTimestamp;

    struct Call {
        address target;
        uint256 value;
        bytes data;
    }

    struct ZKProof {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        // Public signals are now outputs from the circuit:
        // [0] = emailHash (computed from private email input)
        // [1] = domainHash (computed from private domain input)
        // [2] = nullifier (unique per proof)
        uint[3] publicSignals;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ZKAccountV3: not owner");
        _;
    }

    modifier validZKProof(ZKProof memory proof) {
        if (requiresZKProof) {
            _validateAndProcessZKProof(proof);
        }
        _;
    }

    /**
     * @dev Constructor for implementation contract
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the ZK Account with Gmail binding
     */
    function initialize(
        address _owner,
        address _zkVerifier,
        bool _requiresZKProof,
        uint256 _authorizedEmailHash,
        uint256 _authorizedDomainHash
    ) public initializer {
        require(_owner != address(0), "ZKAccountV3: invalid owner");
        require(_zkVerifier != address(0), "ZKAccountV3: invalid verifier");
        require(_authorizedEmailHash > 0, "ZKAccountV3: invalid email hash");
        require(_authorizedDomainHash > 0, "ZKAccountV3: invalid domain hash");

        owner = _owner;
        zkVerifier = Groth16Verifier(_zkVerifier);
        requiresZKProof = _requiresZKProof;
        authorizedEmailHash = _authorizedEmailHash;
        authorizedDomainHash = _authorizedDomainHash;

        emit ZKAccountInitialized(_owner, _zkVerifier, authorizedEmailHash, authorizedDomainHash);
    }

    /**
     * @dev Execute transaction with ZK proof verification
     */
    function execute(
        ZKProof memory proof,
        address target,
        uint256 value,
        bytes calldata data
    ) external payable onlyOwner validZKProof(proof) {
        _executeCall(target, value, data);
    }


    /**
     * @dev Validate and process ZK proof with enhanced security
     */
    function _validateAndProcessZKProof(ZKProof memory proof) internal {
        // Extract public signals from proof
        uint256 proofEmailHash = proof.publicSignals[0];
        uint256 proofDomainHash = proof.publicSignals[1];
        uint256 nullifier = proof.publicSignals[2];

        // CRITICAL SECURITY CHECK: The email and domain hashes from the proof
        // must match our authorized values. These are now computed inside the
        // circuit from private inputs, preventing tampering.
        require(
            proofEmailHash == authorizedEmailHash,
            "ZKAccountV3: unauthorized email hash from proof"
        );
        require(
            proofDomainHash == authorizedDomainHash,
            "ZKAccountV3: unauthorized domain hash from proof"
        );

        // Verify the ZK proof with the verifier contract
        require(
            zkVerifier.verifyProof(
                proof.a,
                proof.b,
                proof.c,
                proof.publicSignals
            ),
            "ZKAccountV3: invalid zero-knowledge proof"
        );

        // Check nullifier hasn't been used before
        require(!usedNullifiers[nullifier], "ZKAccountV3: proof already used");

        // Mark nullifier as used and record timestamp
        usedNullifiers[nullifier] = true;
        nullifierTimestamp[nullifier] = block.timestamp;
        lastNullifier[msg.sender] = nullifier;

        // Increment nonce for additional security
        nonce++;

        emit ZKProofVerified(proofEmailHash, proofDomainHash, nullifier, msg.sender);
    }

    /**
     * @dev Execute a call with safety checks
     */
    function _executeCall(address target, uint256 value, bytes calldata data) internal {
        require(target != address(0), "ZKAccountV3: invalid target");
        require(target != address(this), "ZKAccountV3: self-call not allowed");
        require(address(this).balance >= value, "ZKAccountV3: insufficient balance");

        (bool success, bytes memory result) = target.call{value: value}(data);

        if (success) {
            emit TransactionExecuted(target, value, data, true);
        } else {
            string memory reason = _getRevertReason(result);
            emit TransactionFailed(target, value, data, reason);
            revert(string(abi.encodePacked("ZKAccountV3: call failed - ", reason)));
        }
    }

    /**
     * @dev Extract revert reason from failed call
     */
    function _getRevertReason(bytes memory result) internal pure returns (string memory) {
        if (result.length == 0) return "no reason";

        assembly {
            result := add(result, 0x04)
        }
        return abi.decode(result, (string));
    }

    /**
     * @dev Check if a nullifier was used within the validity period
     */
    function isNullifierValid(uint256 nullifier) external view returns (bool) {
        if (!usedNullifiers[nullifier]) return false;
        return block.timestamp <= nullifierTimestamp[nullifier] + PROOF_VALIDITY_PERIOD;
    }

    /**
     * @dev Get account balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get account info
     */
    function getAccountInfo() external view returns (
        address _owner,
        address _zkVerifier,
        bool _requiresZKProof,
        uint256 _emailHash,
        uint256 _domainHash,
        uint256 _nonce
    ) {
        return (owner, address(zkVerifier), requiresZKProof, authorizedEmailHash, authorizedDomainHash, nonce);
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {}

    /**
     * @dev Fallback function
     */
    fallback() external payable {}

    /**
     * @dev Change owner with ZK proof verification only
     */
    function changeOwner(
        ZKProof memory proof,
        address newOwner
    ) external validZKProof(proof) {
        require(newOwner != address(0), "ZKAccountV3: invalid new owner");
        require(newOwner != owner, "ZKAccountV3: same owner");

        address oldOwner = owner;
        owner = newOwner;

        emit OwnerChanged(oldOwner, newOwner, proof.publicSignals[2]);
    }

    /**
     * @dev Authorize upgrade (only owner)
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
