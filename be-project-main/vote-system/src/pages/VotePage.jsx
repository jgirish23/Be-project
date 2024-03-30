import { useEffect, useState } from "react";
import useMyStore from "../hooks/store";
import { addVote, fetchCandidates, getEventDetails } from "../actions/contractActions";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import VOTING from "../abis/voting.json";
import { Button, Table } from "react-bootstrap";

export default function Vote() {
  const [votingContract, setVotingContract] = useState();
  const [candidates, setCandidates] = useState([]);
  const [eventDetails, setEventDetails] = useState();
  const { address } = useParams();
  const { signer } = useMyStore();

  useEffect(() => {
    async function init() {
      if (address && signer) {
        const contract = new ethers.Contract(address, VOTING.abi, signer);
        setVotingContract(contract);
        const details = await getEventDetails(contract);
        setEventDetails(details);
      }
    }
    init();
  }, [signer]);

  useEffect(() => {
    if (votingContract) {
      getCandidates();
    }
  }, [votingContract]);

  async function getCandidates() {
    const candidatesArr = await fetchCandidates(votingContract);
    console.log("candidates: ", candidatesArr);
    setCandidates(candidatesArr);
  }

  async function handleVote(candidateName) {
    await addVote(votingContract, signer, candidates, candidateName);
    await getCandidates();
  }

  return (
    <div className="container">
      {eventDetails && (
        <div className="d-flex align-items-center justify-content-around">
          <h1 className="mb-4">{eventDetails[0]}</h1>
          <h4>Managed by: {eventDetails[1]}</h4>
        </div>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Votes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.votes}</td>
              <td>
                <Button onClick={() => handleVote(c.name)}>Vote</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
