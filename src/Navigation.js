import { Home } from "./pages";
import { Routes, BrowserRouter, Route } from "react-router-dom";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
