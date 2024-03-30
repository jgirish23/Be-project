import { ethers } from "ethers";
import { Button, Spinner } from "react-bootstrap";
import { useEffect } from "react";

import useMyStore from "../hooks/store";
import FACTORY from "../abis/factory.json";

function Navbar() {
  const {
    setLoading,
    loading,
    account,
    setAccount,
    setSigner,
    setFactoryContract,
  } = useMyStore();

  const disconnect = async () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        window.localStorage.removeItem("Connected");
        window.location.reload();
      } else {
      }
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        connect();
      }
    }
  }, []);

  const connect = async () => {
    setLoading(true);
    if (typeof window.ethereum !== "undefined") {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      window.localStorage.setItem("Connected", "injected");
      console.log("account:", account);
      setAccount(account);
      document.getElementById("connectbtn").innerHTML = account;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer: ", signer);
      setSigner(signer);

      const contract = new ethers.Contract(
        FACTORY.address,
        FACTORY.abi,
        signer
      );
      setFactoryContract(contract);
      console.log("factory contract", contract);
    }
  };

  return (
    <div>
      <p
        className="text-center h5 p-3"
        style={{
          backgroundColor: "#2c3e50", // Dark blue background
          color: "#ecf0f1", // Light gray text color
          marginBottom: 0,
        }}
      >
        Decentralized Voting System
      </p>
      <div className="d-flex justify-content-center justify-content-md-between align-items-center p-3">
        <Button
          onClick={connect}
          id="connectbtn"
          variant="primary"
          className="mx-2"
          disabled={account}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-2"
            />
          ) : null}
          Connect
        </Button>
        <Button
          onClick={disconnect}
          id="Dissconnectbtn"
          variant="danger"
          className="mx-2"
          disabled={!account}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
