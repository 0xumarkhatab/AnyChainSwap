pragma solidity ^0.8.0;

import "./TokenBase.sol";

contract TokenEth1 is TokenBase {
    constructor() TokenBase("Eth Token1", "ETHTK1") {}
}
