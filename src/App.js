import { Route, Routes } from "react-router-dom"
import "./App.css"
import Login from "./pages/Login"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/create" element={<Create />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}
