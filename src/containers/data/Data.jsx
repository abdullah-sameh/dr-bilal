import "./data.css";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../rtk/slices/userSlice";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { getAllPatients } from "../../rtk/slices/allPatientsSlice";
import { deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import PatientDetails from "../patientDetails/PatientDetails";

export default function Data() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showedData, setShowedData] = useState([]);
  const patientsData = useSelector((state) => state.allPatients);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        navigate("/");
      }
    });
    dispatch(getAllPatients());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowedData(patientsData);
  }, [patientsData]);

  const searchHandler = (e) => {
    if (parseInt(e.currentTarget.value)) {
      setShowedData(
        patientsData.filter((patient) =>
          patient?.data?.code?.includes(e.currentTarget.value)
        )
      );
    } else {
      setShowedData(
        patientsData.filter((patient) =>
          patient?.data?.name?.includes(e.currentTarget.value)
        )
      );
    }
  };

  const deletePatient = async (patientId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `من أنك تريد حذف هذه البيانات؟`,
      showDenyButton: true,
      confirmButtonText: "تأكيد",
      denyButtonText: `إالغاء`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "patients", patientId))
          .then(() => {
            dispatch(getAllPatients());
            Swal.fire({
              position: "center",
              icon: "success",
              title: "تم الحذف بنجاح",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((e) => {
            console.log(e.message);
            Swal.fire({
              icon: "error",
              title: "خطأ",
              text: "حاول مرة أخرى!",
            });
          });
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="all-patients">
        <div className="container">
          <form>
            <input
              type="search"
              placeholder="إبحث من هنا..."
              onChange={searchHandler}
            />
          </form>
          <table className="data-table">
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
              {showedData?.map((patient) => (
                <tr key={patient?.id}>
                  <td>{patient?.data?.code}</td>
                  <td>{patient?.data?.name}</td>
                  <td>
                    {patient?.data?.previousVisits?.length === 0
                      ? "----"
                      : patient?.data?.previousVisits[
                          patient?.data?.previousVisits?.length - 1
                        ].reason}
                  </td>
                  <td>
                    {patient?.data?.previousVisits?.length === 0
                      ? "----"
                      : patient?.data?.previousVisits[
                          patient?.data?.previousVisits?.length - 1
                        ].visitDate}
                  </td>
                  <td>
                    <Link
                      className="btn btn-success mx-1"
                      to={`/data/newBook/${patient?.id}`}
                    >
                      حجز جديد
                    </Link>
                    <Link
                      className="btn btn-primary mx-1"
                      to={`/data/details/${patient?.id}`}
                    >
                      تفاصيل
                    </Link>
                    <button
                      onClick={() => deletePatient(patient?.id)}
                      className="delete btn btn-danger mx-1"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Routes>
        <Route path="/:patientId" element={<PatientDetails />} />
      </Routes>
    </>
  );
}
