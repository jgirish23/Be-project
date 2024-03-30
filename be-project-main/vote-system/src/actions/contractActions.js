import { decryptVoteSum, encryptVote } from "./apiActions";
const offset = 1;

export async function addCandidates(contract, signer, candidates) {
  console.log("addCandi: ", candidates);
  const contractSigner = await contract.connect(signer);
  const tx = await contractSigner.addCandidates(candidates);

  const receipt = await tx.wait();
  if (receipt.status === 1) {
    return true;
  } else {
    return false;
  }
}

export async function createElection(contract, signer, event, manager) {
  console.log("createElection: ", event, manager);
  const contractSigner = await contract.connect(signer);
  const tx = await contractSigner.createVoting(event, manager);

  const receipt = await tx.wait();
  if (receipt.status === 1) {
    return true;
  } else {
    return false;
  }
}

export async function addVote(contract, signer, candidates, candidateName) {
  console.log("handleVote for candi: ", candidateName);

  const votes = [];

  for (let i = 0; i < candidates.length; i++) {
    const vote = candidates[i].name === candidateName ? 1 + offset : offset;
    const encryptedVote = await encryptVote(vote);
    console.log("vote: ", vote, encryptedVote);
    votes.push(encryptedVote);
  }

  const contractSigner = await contract.connect(signer);
  const tx = await contractSigner.voteMultiple(votes);

  const receipt = await tx.wait();
  if (receipt.status === 1) {
    return true;
  } else {
    return false;
  }
}

export async function fetchCandidates(contract) {
  // candidatesData = [names, encryptedVotes];
  const candidatesData = await contract.getCandidates();

  const candidatesArr = [];
  const numVotesInBigNumber = await contract.getNumVotes();
  const numVotes = numVotesInBigNumber.toNumber();
  for (let i = 0; i < candidatesData[0].length; i++) {
    const encryptedSumInBigNumber = candidatesData[1][i];
    let encryptedSum = encryptedSumInBigNumber.toNumber();
    let decryptedSum = await decryptVoteSum(encryptedSum);
    decryptedSum = decryptedSum - numVotes * offset;
    candidatesArr.push({
      name: candidatesData[0][i],
      votes: decryptedSum,
    });
  }

  return candidatesArr;
}

export async function canCandidatesBeAddedGetter(contract) {
  return await contract.canCandidatesBeAddedGetter();
}

export async function getEventDetails(contract) {
  return await contract.getEventDetails();
}
