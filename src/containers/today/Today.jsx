import Navbar from "../../components/navbar/Navbar"
import "./today.css"

export default function Today() {
  return (
    <>
      <Navbar />
      <div className="container today">
        <table className="today-table data-table">
          <thead>
            <tr>
              <td>الرقم</td>
              <td>الاسم</td>
              <td>التاريخ</td>
              <td>التفاصيل</td>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </>
  )
}
