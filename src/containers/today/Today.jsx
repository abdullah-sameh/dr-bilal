import { useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import "./today.css"

export default function Today() {
  const [time, setTime] = useState("الكل")

  return (
    <>
      <Navbar />
      <div className="container today">
        <select
          class="form-select mb-3 fs-2"
          aria-label="Default select example"
          onChange={(e) => setTime(e.target.value)}
          value={time}
        >
          <option value="الكل">الكل</option>
          <option value="اليوم">اليوم</option>
          <option value="الاسبوع">الاسبوع</option>
          <option value="الشهر">الشهر</option>
        </select>

        <table className="today-table data-table">
          <thead>
            <tr>
              <td>الرقم</td>
              <td>الاسم</td>
              <td>اخر زيارة</td>
              <td>التاريخ</td>
              <td>التفاصيل</td>
            </tr>
          </thead>
          <tbody>
            {/* <tr key={patient?.id}>
              <td>{patient?.data?.code}</td>
              <td>{patient?.data?.name}</td>
              <td>
                {patient?.data?.previousVisits.length === 0
                  ? "----"
                  : patient?.data?.previousVisits[
                      patient?.data?.previousVisits.length - 1
                    ].reason}
              </td>
              <td>
                {patient?.data?.previousVisits.length === 0
                  ? "----"
                  : patient?.data?.previousVisits[
                      patient?.data?.previousVisits.length - 1
                    ].visitDate}
              </td>
              <td>
                <Link to={`./${patient?.id}`}>تفاصيل</Link>
                <button
                  onClick={() => deletePatient(patient?.id)}
                  className="delete"
                >
                  حذف
                </button>
                <button
                  onClick={() => }
                  className="attend"
                >
                  حضر
                </button>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </>
  )
}
