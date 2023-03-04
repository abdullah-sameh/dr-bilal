import "./data.css";
import Navbar from "../../components/navbar/Navbar";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../../rtk/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function Data() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <div className="data container">
        <form>
          <input type="search" />
        </form>
        <table className="data-table">
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
              <td className="many">
                <p>حشو عصب</p>
                <p>خلع درس</p>
                <p>خلع درسين</p>
              </td>
              <td className="many">
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
              <td className="many">
                <p>حشو عصب</p>
                <p>خلع درس</p>
                <p>خلع درسين</p>
              </td>
              <td className="many">
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
  );
}
