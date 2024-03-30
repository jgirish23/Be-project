import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

function ElectionForm({ onElectionCreate }) {
  const [event, setEvent] = useState("");
  const [manager, setManager] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onElectionCreate(event, manager);
    setEvent("");
    setManager("");
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter event name"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Manager</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter manager name"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Election
        </Button>
      </Form>
    </Container>
  );
}

export default ElectionForm;
