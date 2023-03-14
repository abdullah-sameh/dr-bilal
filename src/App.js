import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./containers/login/Login";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PagesRoutes from "./containers/pagesRoutes/PagesRoutes";

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<PagesRoutes />} />
      </Routes>
    </LocalizationProvider>
  );
}
