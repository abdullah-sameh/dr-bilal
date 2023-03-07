import { Route, Routes } from "react-router-dom"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min"
import "./App.css"
import Add from "./containers/add/Add"
import Data from "./containers/data/Data"
import Home from "./containers/home/Home"
import Login from "./containers/login/Login"
import Today from "./containers/today/Today"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/data/*" element={<Data />} />
      <Route path="/today-book" element={<Today />} />
    </Routes>
  )
}
