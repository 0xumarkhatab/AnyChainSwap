pragma solidity ^0.8.0;

import "./BridgeBase.sol";

contract BridgeArbitrum is SwapBridgeBase {
    constructor(address token) SwapBridgeBase(token) {}
}
