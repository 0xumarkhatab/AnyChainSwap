pragma solidity ^0.8.0;

import "./TokenBase.sol";

contract TokenEth2 is TokenBase {
    constructor() TokenBase("Eth Token2", "ETHTK2") {}
}
