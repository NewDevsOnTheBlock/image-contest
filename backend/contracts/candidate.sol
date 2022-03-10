// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "./VoteManager.sol";

contract Candidate {
    VoteManager private parentContract;

    constructor(VoteManager _parentContract) public {
        parentContract = _parentContract;
    }
}
