//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./candidate.sol";

contract VoteManager {


    enum VoteStatus{CREATED, OPEN, CLOSED}

    struct C_Canditate {
        Candidate _candidate;
        uint _totalVote;
        string _name;
    }

    VoteManager.VoteStatus _status;
    address internal winner;

    mapping(address => C_Canditate) public candidates;
    mapping(address => bool) public hasAddressVoted;

    event VoteStatusEvent(address _candidateAddress, uint _status);
    event Voted(address _candidateAddress, address _voterAddress, uint _totalVote);
    event Winner(C_Canditate winner);
    event candidateCreated(address canditate, string name);

    function createCanditate(string memory _name) public {
        Candidate candidate = new Candidate(this);
        address _address = address(candidate);
        candidates[_address]._candidate = candidate;
        candidates[_address]._name = _name;

        emit candidateCreated(_address, _name);
    }

    function vote(address _forCandidate) public {
        hasAddressVoted[msg.sender] = true;
        candidates[_forCandidate]._totalVote += 1;

        emit Voted(_forCandidate, msg.sender, candidates[_forCandidate]._totalVote);

        if (candidates[_forCandidate]._totalVote > candidates[winner]._totalVote){
            winner =  _forCandidate;
        }
    }

    function getTotalVote(address _forCandidate) public view returns(uint) {
        return candidates[_forCandidate]._totalVote;
    }

    function getWinner() public {
        emit Winner(candidates[winner]);
    }
}
