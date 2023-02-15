pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapBridgeBase {
    IERC20[] public tokens;

    mapping(address => mapping(bytes => bool)) processedUserSignatures;

    constructor(
        address _token1,
        address _token2,
        address _token3,
        address _token4,
        address _token5
    ) {
        tokens.push(IERC20(_token1));
        tokens.push(IERC20(_token2));
        tokens.push(IERC20(_token3));
        tokens.push(IERC20(_token4));
        tokens.push(IERC20(_token5));
    }

    event DepositSuccess(
        address user,
        uint tokenNumber,
        uint amount,
        uint nonce,
        bytes signature,
        string sourceChain,
        string destinationChain
    );
    event WithdrawSuccess(
        address user,
        uint tokenNumber,
        uint amount,
        uint nonce,
        bytes signature,
        string sourceChain,
        string destinationChain
    );

    function swap(
        address user,
        uint tokenNumber,
        uint amount,
        uint nonce,
        bytes memory signature,
        string memory sourceChain,
        string memory destinationChain
    ) public {
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(user, amount, nonce))
        );
        require(
            recoverSigner(message, signature) == user,
            "Signature Error: Not Signed by the Proposer"
        );
        // 0x7ec4d3fb081bd6db1102f7cfd085984fb7ab4e8e04de61f2b94dcd7858778d14159aed4255970932617ad4ffd1e75d301764162bca181b8cdec183db9f1a446e1c
        // 0x7ec4d3fb081bd6db1102f7cfd085984fb7ab4e8e04de61f2b94dcd7858778d14159aed4255970932617ad4ffd1e75d301764162bca181b8cdec183db9f1a446e1c
        require(
            tokenNumber < tokens.length && tokenNumber > 0,
            "Invalid token Number"
        );
        IERC20 token = tokens[tokenNumber - 1];

        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Insufficient Allowance to contract"
        );
        // take tokens in from user

        token.transferFrom(user, address(this), amount);
        processedUserSignatures[user][signature] = false;

        emit DepositSuccess(
            user,
            tokenNumber,
            amount,
            nonce,
            signature,
            sourceChain,
            destinationChain
        );
    }

    function withdraw(
        address user,
        uint tokenNumber,
        uint amount,
        uint nonce,
        bytes memory signature,
        string memory sourceChain,
        string memory destinationChain
    ) public {
        // if the signature is valid
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(user, amount, nonce))
        );
        require(
            recoverSigner(message, signature) == user,
            "Signature Error: Not Signed by the Proposer"
        );
        require(
            !processedUserSignatures[user][signature],
            "Transaction has already been processed!"
        );
        IERC20 token = tokens[tokenNumber - 1];

        token.transfer(user, amount);
        processedUserSignatures[user][signature] = true;

        emit WithdrawSuccess(
            user,
            tokenNumber,
            amount,
            nonce,
            signature,
            sourceChain,
            destinationChain
        );
    }

    function isTransactionProcessed(
        address user,
        bytes memory signature
    ) public returns (bool) {
        return processedUserSignatures[user][signature];
    }

    /** Signature Verification Utilities */

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(
        bytes32 message,
        bytes memory sig
    ) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (uint8, bytes32, bytes32) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
