//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import { AddressHasAlreadyVoted } from "./helpers.sol";

contract VoteManager {

    enum VoteStatus{CREATED, OPEN, CLOSED}

    struct Candidate {
        uint _totalVote;
        string _name;
        string _imageHash;
    }

    VoteManager.VoteStatus _status;
    address internal winner;

    mapping(address => Candidate) public candidates;
    mapping(address => bool) public hasAddressVoted;

    event VoteStatusEvent(address _candidateAddress, uint _status);
    event Voted(address indexed _candidateAddress, address indexed _voterAddress, uint _totalVote);
    event candidateCreated(address indexed canditateAddress, string name);

    function registerCanditate(string memory _name, string memory _imageHash) public {
        Candidate memory newCandidate = Candidate(0, _name, _imageHash);
        address _address = address(msg.sender);
        candidates[_address] = newCandidate;

        emit candidateCreated(_address, _name);
    }

    function vote(address _forCandidate) public {
        if (hasAddressVoted[msg.sender])
            revert AddressHasAlreadyVoted({
            voter: msg.sender
            });

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

    function getWinner() public view returns(Candidate memory){
        return candidates[winner];
    }
}
