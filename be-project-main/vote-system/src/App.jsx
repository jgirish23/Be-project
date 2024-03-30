import * as ReactBootStrap from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import UploadData from "./pages/UploadData";
import Vote from "./pages/VotePage";

import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <ReactBootStrap.Container fluid className="p-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="add/:address" element={<UploadData />} />
        <Route path="/vote/:address" element={<Vote />} />
      </Routes>
    </ReactBootStrap.Container>
  );
}

export default Home;
