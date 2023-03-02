import "./add.css";
import Navbar from "../../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
// import { useReducer } from "react";
import { next, undo } from "../../components/tools";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { setUser } from "../../rtk/slices/userSlice";

// const initialState = {
//   nameForm: true,
//   infoForm: false,
//   nameFormClass: "",
//   infoFormClass: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "setName":
//       return { ...state, nameForm: action.payload };
//     case "setInfo":
//       return { ...state, infoForm: action.payload };
//     case "setNameClass":
//       return { ...state, nameFormClass: action.payload };
//     case "setInfoClass":
//       return { ...state, infoFormClass: action.payload };
//     default:
//       return state;
//   }
// }

export default function Add() {
  // const [state, dispatch] = useReducer(reducer, initialState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let state = {
    nameForm: true,
    infoForm: false,
    nameFormClass: "",
    infoFormClass: "",
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        navigate("/");
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="add">
        <div className="container">
          {state.nameForm && (
            <form className={"animate__animated " + state.nameFormClass}>
              <label htmlFor="name">اسم العميل</label>
              <input type="text" />
              <Link onClick={() => next(dispatch)} type="submit">
                أضف
              </Link>
            </form>
          )}
          {state.infoForm && (
            <form className={"animate__animated " + state.infoFormClass}>
              <label htmlFor="operation">label</label>
              <input type="text" />
              <Link onClick={() => undo(dispatch)}>undo</Link>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
