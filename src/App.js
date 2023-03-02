import { Route, Routes } from "react-router-dom";
import "./App.css";
import Add from "./containers/add/Add";
import Data from "./containers/data/Data";
import Home from "./containers/home/Home";
import Login from "./containers/login/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/data" element={<Data />} />
    </Routes>
  );
}
