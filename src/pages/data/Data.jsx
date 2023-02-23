import './data.css'
import Navbar from "../../component/navbar/Navbar"

export default function Data() {

  return (
    <>
      <Navbar />
      <div className="data container">
        <form>
          <input type="search" />
        </form>
        <table>
          <thead>
            <tr>
              <td>الرقم</td>
              <td>الاسم</td>
              <td>العملية</td>
              <td>التاريخ</td>
              <td>الحالة المزاجية</td>
              <td>التفاصيل</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>230</td>
              <td>عبدالله سامح ماهر حسنين محكد ابراهيم السباعي</td>
              <td className='many'>
                <p>حشو عصب</p>
                <p>خلع درس</p>
                <p>خلع درسين</p>
              </td>
              <td className='many'>
                <p>23/4/2015</p>
                <p>02/5/2022</p>
                <p>07/6/2022</p>
              </td>
              <td>مش مهم</td>
              <td>
                <button>تفاصيل</button>
              </td>
            </tr>
            <tr>
              <td>230</td>
              <td>عبدالله سامح ماهر</td>
              <td className='many'>
                <p>حشو عصب</p>
                <p>خلع درس</p>
                <p>خلع درسين</p>
              </td>
              <td className='many'>
                <p>23/4/2015</p>
                <p>02/5/2022</p>
                <p>07/6/2022</p>
              </td>
              <td>مش مهم</td>
              <td>
                <button>تفاصيل</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
