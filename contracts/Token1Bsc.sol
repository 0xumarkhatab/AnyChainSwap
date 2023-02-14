pragma solidity ^0.8.0;

import "./TokenBase.sol";

contract TokenBsc1 is TokenBase {
    constructor() TokenBase("BSC Token1", "BSCTK1") {}
}
