import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Add, Data, Reservation, PatientDetails } from "../index";
const PagesRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/data/*" element={<Data />} />
      <Route path="/reservations/*" element={<Reservation />} />
      <Route
        path="/reservations/fillForm/:patientId"
        element={<PatientDetails />}
      />
      <Route
        path="/reservations/editDate/:patientId"
        element={<PatientDetails />}
      />
      <Route path="/data/:patientId" element={<PatientDetails />} />
      <Route path="/data/details/:patientId" element={<PatientDetails />} />
      <Route path="/data/newBook/:patientId" element={<PatientDetails />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
};

export default PagesRoutes;
