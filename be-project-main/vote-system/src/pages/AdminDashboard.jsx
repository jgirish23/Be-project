import * as ReactBootStrap from "react-bootstrap";
import { useEffect, useState } from "react";

import ElectionForm from "../components/ElectionForm";
import ElectionList from "../components/ElectionList";


import useMyStore from "../hooks/store";
import { createElection } from "../actions/contractActions";

export default function AdminDashboard() {
  const { factoryContract, signer } = useMyStore();
  const [elections, setElections] = useState([]);

  async function loadElections() {
    if(!factoryContract){
      console.log("facCon not init abhi");
      return;
    }
    const votings = await factoryContract.getDeployedVotings();
    console.log("all elections: ", votings);
    setElections(votings);
  }

  useEffect(() => {
    loadElections();
  }, [factoryContract]);

  const handleElectionCreate = async (event, manager) => {
    await createElection(factoryContract, signer, event, manager);
    await loadElections();
  };

  return (
    <ReactBootStrap.Container fluid className="p-4">
      <ReactBootStrap.Row>
        <ReactBootStrap.Col>
          <ElectionForm onElectionCreate={handleElectionCreate} />
        </ReactBootStrap.Col>
      </ReactBootStrap.Row>
      <ReactBootStrap.Row className="mt-4">
        <ReactBootStrap.Col>
          <ElectionList elections={elections} />
        </ReactBootStrap.Col>
      </ReactBootStrap.Row>
    </ReactBootStrap.Container>
  );
}
