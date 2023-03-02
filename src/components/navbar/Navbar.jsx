import "./navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

const initialState = {
  home: "",
  add: "",
  data: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "home":
      return { home: "hover" };
    case "add":
      return { add: "hover" };
    case "data":
      return { data: "hover" };
    default:
      return state;
  }
}

export default function Navbar() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const location = useLocation();
  const navigate = useNavigate();

  const signout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حاول مرة أخرى",
        });
      });
  };

  useEffect(() => {
    if (location.pathname === "/home") dispatch({ type: "home" });
    else if (location.pathname === "/add") dispatch({ type: "add" });
    else dispatch({ type: "data" });
  }, [location]);

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
        <div className="left">
          {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={signout}>تسجيل خروج</a>
        </div>
      </div>
    </nav>
  );
}
