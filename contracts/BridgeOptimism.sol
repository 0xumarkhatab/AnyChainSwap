pragma solidity ^0.8.0;

import "./BridgeBase.sol";

contract BridgeOptimism is SwapBridgeBase {
    constructor(address token) SwapBridgeBase(token) {}
}
