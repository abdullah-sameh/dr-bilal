import Navbar from "../component/navbar/Navbar"
import Statics from "../component/statics/Statics"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home">
        <Statics />
      </div>
    </>
  )
}
