import React from "react";
import { ListGroup, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function ElectionList({ elections }) {
  return (
    <Container className="mt-4">
      {elections.length === 0 ? (
        <div className="text-center py-5">
          <h3>No Elections Present</h3>
          <p>There are currently no elections available.</p>
        </div>
      ) : (
        <ListGroup>
          <ListGroup.Item
            style={{ backgroundColor: "#007bff", color: "white" }}
          >
            <Row>
              <Col className="font-weight-bold">Event Name</Col>
              <Col className="font-weight-bold">Event Manager</Col>
              <Col className="font-weight-bold">Contract Address</Col>
            </Row>
          </ListGroup.Item>
          {elections.map((election, index) => (
            <ListGroup.Item key={index}>
              <Row>
                <Col>{election.eventName}</Col>
                <Col>{election.eventManager}</Col>
                <Col>
                  <Link
                    to={"/add/" + election.votingContract}
                    style={{ color: "#007bff" }}
                  >
                    {election.votingContract}
                  </Link>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default ElectionList;
