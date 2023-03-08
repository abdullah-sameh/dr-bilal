import { Route, Routes } from "react-router-dom"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min"
import "./App.css"
import Add from "./containers/add/Add"
import Data from "./containers/data/Data"
import Home from "./containers/home/Home"
import Login from "./containers/login/Login"
import Reservation from "./containers/reservation/Reservations"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/data/*" element={<Data />} />
        <Route path="/reservations/*" element={<Reservation />} />
      </Routes>
    </LocalizationProvider>
  )
}
