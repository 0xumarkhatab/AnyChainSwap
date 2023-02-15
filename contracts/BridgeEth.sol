pragma solidity ^0.8.0;

import "./BridgeBase.sol";

contract BridgeEth is SwapBridgeBase {
    constructor(
        address _token1,
        address _token2,
        address _token3,
        address _token4,
        address _token5
    ) SwapBridgeBase(_token1, _token2, _token3, _token4, _token5) {}
}
