import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssignmentsPage />} />
        <Route path="/assignment/:id" element={<AssignmentDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;