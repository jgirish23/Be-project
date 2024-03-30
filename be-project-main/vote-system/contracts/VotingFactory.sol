// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BlockchainVoting.sol";

contract VotingFactory {
    struct VotingInfo {
        BlockchainVoting votingContract;
        string eventName;
        string eventManager;
    }

    VotingInfo[] public deployedVotings;

    function createVoting(
        string memory eventName,
        string memory eventManager
    ) public {
        // n*n = 129478348561
        BlockchainVoting newVoting = new BlockchainVoting(129478348561, eventName, eventManager);
        deployedVotings.push(VotingInfo(newVoting, eventName, eventManager));
    }

    function getDeployedVotings() public view returns (VotingInfo[] memory) {
        return deployedVotings;
    }
}
