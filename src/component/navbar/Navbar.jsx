import "./navbar.css"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useReducer } from "react"

const initialState = {
  home: "",
  add: "",
  data: "",
}

function reducer(state, action) {
  switch (action.type) {
    case "home":
      return { home: "hover" }
    case "add":
      return { add: "hover" }
    case "data":
      return { data: "hover" }
    default:
      return state
  }
}

export default function Navbar() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/home") dispatch({ type: "home" })
    else if (location.pathname === "/add") dispatch({ type: "add" })
    else dispatch({ type: "data" })
  }, [location])

  return (
    <nav>
      <div className="container">
        <div className="right">
          <Link to="/home" className={state.home}>
            الصفحة الرئيسية
          </Link>
          <Link to="/add" className={state.add}>
            أضف عميل
          </Link>
          <Link to="/data" className={state.data}>
            العملاء
          </Link>
        </div>
        <div className="left"><Link to={'/'}>تسجيل خروج</Link></div>
      </div>
    </nav>
  )
}
