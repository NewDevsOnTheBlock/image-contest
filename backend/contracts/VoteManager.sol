//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import { AddressHasAlreadyVoted } from "./helpers.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VoteManager {

    enum VoteStatus{CREATED, OPEN, CLOSED}

    struct Candidate {
        uint id;
        uint totalVote;
        string name;
        string imageHash;
    }
    using Counters for Counters.Counter;
    Counters.Counter private candidatesIds;

    VoteManager.VoteStatus _status;
    address internal winner;

    mapping(address => Candidate) public candidates;
    mapping (uint=> address ) private accounts;
    mapping(address => bool) public hasAddressVoted;

    event VoteStatusEvent(address _candidateAddress, uint _status);
    event Voted(address indexed _candidateAddress, address indexed _voterAddress, uint _totalVote);
    event candidateCreated(address indexed canditateAddress, string name);

    function registerCanditate(string memory _name, string memory _imageHash) public {
        //check if candidate already registered
        require(candidates[msg.sender].id == 0 || candidates[msg.sender].id > 0, "Candidate already registered");
        candidatesIds.increment();
        uint candidateId = candidatesIds.current();
        Candidate memory newCandidate = Candidate(candidateId, 0, _name, _imageHash);
        address _address = address(msg.sender);
        candidates[_address] = newCandidate;
        accounts[candidateId] = msg.sender;
        emit candidateCreated(_address, _name);
    }

      /* fetches all candidates */
    function fetchCandidates() public view returns ( Candidate[] memory) {
        uint itemCount = candidatesIds.current();

        Candidate[] memory candidatesArray = new Candidate[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Candidate storage currentItem = candidates[accounts[currentId]];
            candidatesArray[i] = currentItem;
        }
        return candidatesArray;
    }


    function vote(address _forCandidate) public {
        require(hasAddressVoted[msg.sender], "Candidate has already voted");

        hasAddressVoted[msg.sender] = true;
        candidates[_forCandidate].totalVote += 1;

        emit Voted(_forCandidate, msg.sender, candidates[_forCandidate].totalVote);

        if (candidates[_forCandidate].totalVote > candidates[winner].totalVote){
            winner =  _forCandidate;
        }
    }

    function getTotalVote(address _forCandidate) public view returns(uint) {
        return candidates[_forCandidate].totalVote;
    }

    function getWinner() public view returns(Candidate memory){
        return candidates[winner];
    }
}
