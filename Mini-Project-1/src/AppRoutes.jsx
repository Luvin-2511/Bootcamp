import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RoadMap from "./pages/RoadMap";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<RoadMap />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
