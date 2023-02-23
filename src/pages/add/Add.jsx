import "./add.css"
import Navbar from "../../component/navbar/Navbar"
import { Link } from "react-router-dom"
import { useReducer } from "react"
import { next, undo } from "../../component/tools"


const initialState = {
  nameForm: true,
  infoForm: false,
  nameFormClass: "",
  infoFormClass: "",
}

function reducer(state, action) {
  switch (action.type) {
    case "setName":
      return { ...state, nameForm: action.payload }
    case "setInfo":
      return { ...state, infoForm: action.payload }
    case "setNameClass":
      return { ...state, nameFormClass: action.payload }
    case "setInfoClass":
      return { ...state, infoFormClass: action.payload }
    default:
      return state
  }
}

export default function Add() {
  const [state, dispatch] = useReducer(reducer, initialState)

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
  )
}
