// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainVoting {
    string eventName;
    string eventManager;
    uint256 nsq;
    uint256 numVotes;
    string[] candidateNames;
    uint256[] candidateVotes;
    bool canCandidatesBeAdded = true;

    constructor(
        uint256 _nsq,
        string memory _eventName,
        string memory _eventManager
    ) {
        // n*n = 129478348561
        nsq = _nsq;
        eventName = _eventName;
        eventManager = _eventManager;
    }

    function addCandidates(string[] memory candidates) public {
        require(
            canCandidatesBeAdded == true,
            "Candidate addition window has closed"
        );
        for (uint256 i = 0; i < candidates.length; i++) {
            candidateNames.push(candidates[i]);
            candidateVotes.push(0);
        }
        canCandidatesBeAdded = false;
    }

    function canCandidatesBeAddedGetter() public view returns (bool) {
        return canCandidatesBeAdded;
    }

    function voteMultiple(uint256[] memory votes) public {
        require(votes.length == candidateNames.length, "Invalid data passed.");

        for (uint256 i = 0; i < votes.length; i++) {
            if (candidateVotes[i] == 0) {
                candidateVotes[i] = votes[i];
            } else {
                // (a * b) % pub.n_sq
                candidateVotes[i] = (candidateVotes[i] * votes[i]) % nsq;
            }
        }
        numVotes += 1;
    }

    function getNumVotes() public view returns (uint256) {
        return numVotes;
    }

    function getCandidates()
        public
        view
        returns (string[] memory, uint256[] memory)
    {
        return (candidateNames, candidateVotes);
    }

    function getEventDetails()
        public
        view
        returns (string memory, string memory)
    {
        return (eventName, eventManager);
    }
}
