// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoalListPage from "./pages/Goals";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/goals" element={<GoalListPage />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
