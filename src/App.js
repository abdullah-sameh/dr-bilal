import { Route, Routes } from "react-router-dom"
import "./App.css"
import Add from "./pages/add/Add"
import Data from "./pages/data/Data"
import Home from "./pages/Home"
import Login from "./pages/login/Login"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/data" element={<Data />} />
    </Routes>
  )
}
