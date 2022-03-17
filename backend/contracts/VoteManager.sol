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
        address candidateAddress;
    }
    using Counters for Counters.Counter;
    Counters.Counter private candidatesIds;

    VoteManager.VoteStatus _status;
    address internal winner;

    mapping(address => Candidate) private candidates;
    mapping(uint=> address ) private accounts;
    mapping(address => bool) public hasAddressVoted;

    event VoteStatusEvent(address _candidateAddress, uint _status);
    event Voted(address indexed _candidateAddress, address indexed _voterAddress, uint _totalVote);
    event candidateCreated(address indexed canditateAddress, string name);

    function registerCandidate(string calldata _name, string calldata _imageHash) external {
        //check if candidate already registered
        require(msg.sender != address(0));
        require(candidates[msg.sender].id == 0 || candidates[msg.sender].id > 0, "Candidate already registered");
        
        candidatesIds.increment();
        uint candidateId = candidatesIds.current();
        address _address = address(msg.sender);
        Candidate memory newCandidate = Candidate(candidateId, 0, _name, _imageHash, _address);
        candidates[_address] = newCandidate;
        accounts[candidateId] = msg.sender;
        emit candidateCreated(_address, _name);
    }

      /* fetches all candidates */
    function fetchCandidates() external view returns ( Candidate[] memory) {
        uint itemCount = candidatesIds.current();

        Candidate[] memory candidatesArray = new Candidate[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Candidate memory currentCandidate = candidates[accounts[currentId]];
            candidatesArray[i] = currentCandidate;
        }
        return candidatesArray;
    }


    function vote(address _forCandidate) public {
        // require(hasAddressVoted[msg.sender], "Candidate has already voted");
        console.log('dieser account voted jetzt', msg.sender);
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
