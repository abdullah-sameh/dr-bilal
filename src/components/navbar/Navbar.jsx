import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { HiMenuAlt4 } from "react-icons/hi";
import logo from "../../assets/logo.png";
import Swal from "sweetalert2";

// const initialState = {
//   home: "",
//   add: "",
//   data: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "home":
//       return { home: "hover" };
//     case "add":
//       return { add: "hover" };
//     case "data":
//       return { data: "hover" };
//     default:
//       return state;
//   }
// }

export default function Navbar() {
  // const [state, dispatch] = useReducer(reducer, initialState);

  // const location = useLocation();
  const navigate = useNavigate();

  const signout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حاول مرة أخرى",
        });
      });
  };

  // useEffect(() => {
  //   if (location.pathname === "/home") dispatch({ type: "home" });
  //   else if (location.pathname === "/add") dispatch({ type: "add" });
  //   else dispatch({ type: "data" });
  // }, [location]);

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="navbar-brand" href="">
            <img src={logo} alt="araac_logo" /> <span>آراك</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <HiMenuAlt4 />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/home" aria-current="page" className={`nav-link`}>
                  الصفحة الرئيسية
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/add" className={` nav-link`}>
                  أضف عميل
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/data" className={` nav-link`}>
                  العملاء
                </Link>
              </li>
              <li className="nav-item">
                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="nav-link" onClick={signout}>
                  تسجيل خروج
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* <nav>
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
            // {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      {/* <a onClick={signout}>تسجيل خروج</a>
          </div>
        </div>
      </nav> */}
    </>
  );
}
