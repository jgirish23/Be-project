import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Table, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import VOTING from "../abis/voting.json";
import useMyStore from "../hooks/store";
import {
  addCandidates,
  canCandidatesBeAddedGetter,
  getEventDetails,
} from "../actions/contractActions";

const CsvUploadDisplay = () => {
  const { address } = useParams();
  const { signer } = useMyStore();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [goToVote, setGoToVote] = useState(false);
  const [votingContract, setVotingContract] = useState();
  const [eventDetails, setEventDetails] = useState();

  useEffect(() => {
    async function init() {
      if (address && signer) {
        const contract = new ethers.Contract(address, VOTING.abi, signer);
        setVotingContract(contract);
        const canCandidatesBeAdded = await canCandidatesBeAddedGetter(contract);
        if (!canCandidatesBeAdded) {
          navigate(`/vote/${address}`);
          return;
        }
        const details = await getEventDetails(contract);
        setEventDetails(details);
      }
    }
    init();
  }, [signer]);

  const parseCsv = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        setData(result.data);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    parseCsv(file);
  };

  const handleCandidates = async () => {
    try {
      if (!votingContract) return;
      let names = [];
      console.log("data: ", data);
      data.forEach((row) => {
        names.push(row.name);
      });

      await addCandidates(votingContract, signer, names);
      setGoToVote(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="mt-4">
      {eventDetails && (
        <div className="d-flex align-items-center justify-content-around">
          <h1 className="mb-4">{eventDetails[0]}</h1>
          <h4>Managed by: {eventDetails[1]}</h4>
        </div>
      )}
      <h3 className="mb-4">Add candidates</h3>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload CSV File</Form.Label>
        <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
      </Form.Group>
      {data && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Name</th>
                <th>Year</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.reg_no}</td>
                  <td>{item.name}</td>
                  <td>{item.year}</td>
                  <td>{item.branch}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      {goToVote ? (
        <Link to={`/vote/${address}`}>
          <Button>Go to voting page</Button>
        </Link>
      ) : (
        <>
          <Button disabled={data.length === 0} onClick={handleCandidates}>
            Add Candidates
          </Button>
        </>
      )}
    </Container>
  );
};

export default CsvUploadDisplay;
