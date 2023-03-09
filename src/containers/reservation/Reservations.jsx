import dayjs from "dayjs"
import { doc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, Route, Routes } from "react-router-dom"
import Swal from "sweetalert2"
import Navbar from "../../components/navbar/Navbar"
import { db } from "../../firebase"
import { getAllPatients } from "../../rtk/slices/allPatientsSlice"
import { getStatistics } from "../../rtk/slices/statistcsSlice"
import PatientDetails from "../patientDetails/PatientDetails"
import "./reservation.css"

export default function Reservation() {
  const dispatch = useDispatch()
  
  const [time, setTime] = useState("all")
  const [showedPatients, setShowedPatients] = useState()
  const allPatients = useSelector((state) => state.allPatients)
  const statistics = useSelector((state) => state?.statistics)
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  
  const timeFilterHandler = () => {
    let currentDt = new Date()

    switch (time) {
      case "all":
        //get all people have future appointments
        setShowedPatients(
          allPatients?.filter(
            (patient) => Object.keys(patient?.data?.nextVisit).length !== 0
          )
        )
        break

      case "day":
        //get all people have appointments today
        setShowedPatients(
          allPatients.filter(
            (patient) =>
              patient?.data?.nextVisit?.visitDate ===
              `${currentDt.getFullYear()}-${
                currentDt.getMonth() < 9
                  ? "0" + (currentDt.getMonth() + 1)
                  : currentDt.getMonth() + 1
              }-${
                currentDt.getDate() < 9
                  ? "0" + currentDt.getDate()
                  : currentDt.getDate()
              }`
          )
        )
        break

      case "week":
        let startDt = new Date(currentDt.getFullYear(), 0, 1)

        //get current week number
        let currentDays = Math.floor(
          (currentDt - startDt) / (24 * 60 * 60 * 1000)
        )
        let currentWeekNumber = Math.ceil(currentDays / 7)

        //get all people have appointments this week
        setShowedPatients(
          allPatients.filter((patient) => {
            //get patient appointment week
            let patientDt = new Date(patient?.data?.nextVisit?.visitDate)
            let patientDays = Math.floor(
              (patientDt - startDt) / (24 * 60 * 60 * 1000)
            )
            let patientWeekNumber = Math.ceil(patientDays / 7)

            return currentWeekNumber === patientWeekNumber && patient
          })
        )
        break

      case "month":
        setShowedPatients(
          allPatients?.filter((patient) => {
            let patientDt = new Date(patient?.data?.nextVisit.visitDate)

            if (
              patientDt.getFullYear() === currentDt.getFullYear() &&
              patientDt.getMonth() === currentDt.getMonth()
            )
              return patient
          })
        )
        break

      default:
        break
    }
  }

  useEffect(() => {
    dispatch(getAllPatients())
    dispatch(getStatistics())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    timeFilterHandler()
  }, [allPatients])

  useEffect(() => {
    timeFilterHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  const attendHandler = async (patient) => {
    await setDoc(doc(db, "patients", patient?.id), {
      ...patient?.data,
      nextVisit: {},
      previousVisits: [
        ...patient?.data?.previousVisits,
        patient?.data?.nextVisit,
      ],
    })
      .then(() => {
        if (patient?.data?.nextVisit?.firstTime) {
          //get the old statistics data for this illness
          let dt = new Date()

          //get the object of illness
          let [illnessData] = statistics?.illnesses?.filter((illness) =>
            illness?.name.includes(patient?.data?.nextVisit?.reason)
          )

          //get the index of illness object
          let indexOfIllness = statistics?.illnesses?.indexOf(illnessData)
          let allIllnesses = [...statistics?.illnesses]

          //update month statistics for this illness
          let newData = [...allIllnesses[indexOfIllness]?.data]
          newData[dt.getMonth()] = newData[dt.getMonth()] + 1

          // update illness object in illnesses array
          allIllnesses[indexOfIllness] = {
            name: allIllnesses[indexOfIllness]?.name,
            data: newData,
          }

          //send new statistics
          setDoc(doc(db, "statistics", `${dt.getFullYear()}`), {
            illnesses: allIllnesses,
            year: `${dt.getFullYear()}`,
          })
            .then(() => {
              dispatch(getAllPatients())
              dispatch(getStatistics())
              Swal.fire({
                position: "center",
                icon: "success",
                title: `لقد تم تسجيل حضور ${patient?.data?.name} بنجاح`,
                showConfirmButton: false,
                timer: 1500,
              })
            })
            .catch((e) => {
              console.log(e.message)
              Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "حاول مرة أخرى!",
              })
            })
        } else {
          dispatch(getAllPatients())
          setTime(time)
          Swal.fire({
            position: "center",
            icon: "success",
            title: `لقد تم تسجيل حضور ${patient?.data?.name} بنجاح`,
            showConfirmButton: false,
            timer: 1500,
          })
        }
      })
      .catch((e) => {
        console.log(e.message)
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حاول مرة أخرى!",
        })
      })
  }

  const notattendHandler = async (patient) => {
    await setDoc(doc(db, "patients", patient?.id), {
      ...patient,
      nextVisit: {},
    })
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `لقد تم تسجيل حضور ${patient?.data?.name} بنجاح`,
          showConfirmButton: false,
          timer: 1500,
        })
      })
      .catch((e) => {
        console.log(e.message)
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حاول مرة أخرى!",
        })
      })
  }
  return (
    <>
      <Navbar />
      <div className="container reservations">
        <select
          className="form-select mb-3 fs-2"
          aria-label="Default select example"
          onChange={(e) => setTime(e.target.value)}
          value={time}
        >
          <option value="all">الكل</option>
          <option value="day">اليوم</option>
          <option value="week">الاسبوع</option>
          <option value="month">الشهر</option>
        </select>

        <table className="reservations-table data-table">
          <thead>
            <tr>
              <td>الرقم</td>
              <td>الاسم</td>
              <td>الزيارة القادمة</td>
              <td>التاريخ</td>
              <td>الموعد</td>
              <td>التفاصيل</td>
            </tr>
          </thead>
          <tbody>
            {showedPatients?.map((patient) => (
              <tr key={patient?.id}>
                <td>{patient?.data?.code}</td>
                <td>{patient?.data?.name}</td>
                <td>{patient?.data?.nextVisit?.reason}</td>
                <td>
                  {patient?.data?.nextVisit?.visitDate} --- 
                  {weekDays[dayjs(patient?.data?.nextVisit?.visitDate).day()]}
                </td>
                <td style={{ direction: "ltr" }}>
                  {dayjs()
                    .hour(patient?.data?.nextVisit?.visitTime.split(":")[0])
                    .minute(patient?.data?.nextVisit?.visitTime.split(":")[1])
                    .format("h:mm a")}
                  {/* <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="time"
                      className="border border-0 px-1 text-center m-0 bg-light"
                      value={patient?.data?.nextVisit?.visitTime}
                      disabled
                    />
                  </div> */}
                </td>
                <td>
                  <Link
                    className="btn btn-primary mx-1"
                    to={`./${patient?.id}`}
                  >
                    تفاصيل
                  </Link>
                  <button
                    onClick={() => attendHandler(patient)}
                    className="attend btn btn-success mx-1"
                  >
                    حضر
                  </button>
                  <button
                    onClick={() => notattendHandler(patient)}
                    className="not-attend btn btn-danger mx-1"
                  >
                    لم يحضر
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Routes>
          <Route path="/:patientId" element={<PatientDetails />} />
        </Routes>
      </div>
    </>
  )
}
