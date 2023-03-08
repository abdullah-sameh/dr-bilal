import "./add.css"
import Navbar from "../../components/navbar/Navbar"
import { useNavigate } from "react-router-dom"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import { useReducer } from "react";
// import { next, undo } from "../../components/tools";
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase"
import { setUser } from "../../rtk/slices/userSlice"
import { motion } from "framer-motion"
import { addDoc, collection, getDoc, doc, setDoc } from "firebase/firestore"
import Swal from "sweetalert2"
import Select from "react-select"
import { MobileTimePicker } from "@mui/x-date-pickers"

export default function Add() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const services = [
    { value: "كشف", label: "كشف" },
    { value: "أشعة عادية", label: "أشعة عادية" },
    { value: "حشو بلاتين", label: "حشو بلاتين" },
    { value: "حشو كمبوزت", label: "حشو كمبوزت" },
    { value: "حشو عصب", label: "حشو عصب" },
    { value: "حشو عادى أطفال", label: "حشو عادى أطفال" },
    { value: "حشو عصب أطفال", label: "حشو عصب أطفال" },
    { value: "طاقم متحرك", label: "طاقم متحرك" },
    { value: "خلع عادي", label: "خلع عادي" },
    { value: "خلع ضرس عقل", label: "خلع ضرس عقل" },
    { value: "طربوش", label: "طربوش" },
    { value: "كوبري", label: "كوبري" },
    { value: "تنظيف جير", label: "تنظيف جير" },
    { value: "تبييض", label: "تبييض" },
    { value: "علاج", label: "علاج" },
  ]
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user))
      } else {
        navigate("/")
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePatientData = async (e) => {
    e.preventDefault()
    let formData = e.target

    // get all aptient data
    let patient = {
      name: formData?.patientName?.value,
      phone: formData?.patientPhone?.value,
      birthDate: formData?.patientBirthDate?.value,
      job: formData?.patientJob?.value,
      adresse: formData?.patientAdresse?.value,
      maritalStatus: formData?.socialStatus?.value,
      otherSicks: formData?.anotherSick?.value.toString().trim().split("  "),
      popularSicks: {
        diabetes: formData?.diabetes?.checked,
        highBloodPressure: formData?.highBloodPressure?.checked,
        smoker: formData?.smoker?.checked,
      },
      pregnant: formData?.pregnant?.checked,
      breastfeeding: formData?.breastfeeding?.checked,
      previousSurgeryOperations: formData?.surgeryOperations?.value
        .toString()
        .trim()
        .split("  "),
      allergy: formData?.patientAllergy?.value.toString().trim().split("  "),
      previousVisits: [],
      nextVisit:
        formData?.illness?.value !== ""
          ? {
              reason: formData?.illness?.value,
              visitTime: formData?.visitTime?.value,
              visitDate: formData?.visitDate?.value,
              firstTime: formData?.firstTime?.checked,
            }
          : {},
      opinion: formData?.patientOpinion?.value,
    }

    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `من أنك تريد حجز موعد ل ${formData?.patientName?.value}`,
      showDenyButton: true,
      confirmButtonText: "تأكيد",
      denyButtonText: `إالغاء`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        /* 
        1- get the current number of patients from DB
        2- add the code to patient data
        3- after adding the new patient we send the new current number to DB again 
        */
        await getDoc(doc(db, "patients", "patientsCode"))
          .then((docu) => {
            let dt = new Date()

            addDoc(collection(db, "patients"), {
              ...patient,
              code: `${dt.getFullYear().toString().substr(2)}${
                docu.data().currentNumber + 1
              }`,
            })
              .then(() => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: `لقد تم تسجيل ${formData.patientName.value} بنجاح`,
                  showConfirmButton: false,
                  timer: 1500,
                })
                setDoc(doc(db, "patients", "patientsCode"), {
                  currentNumber: docu.data().currentNumber + 1,
                })
                  .then(() => document.querySelector(".addNewPatient").reset())
                  .catch((e) => {
                    console.log(e.message)
                    Swal.fire({
                      icon: "error",
                      title: "خطأ",
                      text: "حاول مرة أخرى!",
                    })
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
    })
  }

  return (
    <>
      <Navbar />
      <div className="add">
        <div className="container">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="page-title"
          >
            <h1>أضف مريض جديد</h1>
          </motion.div>
          <form onSubmit={handlePatientData} className="addNewPatient">
            <div className="main-info">
              <div className="name">
                <label htmlFor="patientName">اسم المريض</label>
                <input
                  type="text"
                  name="patientName"
                  id="patientName"
                  className="form-control"
                  required
                />
              </div>
              <div className="phone">
                <label htmlFor="patientPhone">رقم الموبايل</label>
                <input
                  type="tel"
                  name="patientPhone"
                  id="patientPhone"
                  className="form-control"
                  required
                />
              </div>
              <div className="none">
                <div className="birth-date">
                  <label htmlFor="patientBirthDate">تاريخ الميلاد</label>
                  <input
                    type="date"
                    name="patientBirthDate"
                    id="patientBirthDate"
                    className="form-control"
                  />
                </div>
                <div className="job">
                  <label htmlFor="patientJob">الوظيفة</label>
                  <input
                    type="text"
                    name="patientJob"
                    id="patientJob"
                    className="form-control"
                  />
                </div>
                <div className="adresse">
                  <label htmlFor="patientAdresse">العنوان</label>
                  <input
                    type="text"
                    name="patientAdresse"
                    id="patientAdresse"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="none">
              <div className="marital-status">
                <h4 className="title">الحالة الاجتماعية</h4>
                <div className="status-container">
                  <label htmlFor="unmarried">أعزب</label>
                  <input
                    type="radio"
                    name="socialStatus"
                    id="unmarried"
                    value={"unmarried"}
                  />

                  <label htmlFor="married">متزوج</label>
                  <input
                    type="radio"
                    name="socialStatus"
                    id="married"
                    value={"married"}
                  />
                </div>
              </div>
              <div className="pregnant-status">
                <h4 className="title">هل أنت؟</h4>
                <div className="status-container">
                  <label htmlFor="pregnant">حامل</label>
                  <input type="checkbox" name="pregnant" id="pregnant" />

                  <label htmlFor="breastfeeding">مرضعة</label>
                  <input
                    type="checkbox"
                    name="breastfeeding"
                    id="breastfeeding"
                  />
                </div>
              </div>
              <div className="sick-history">
                <div className="title">
                  <h4>هل لديك أمراض مثل؟</h4>
                </div>
                <div className="popular-sicks">
                  <div className="sick-container">
                    <label htmlFor="diabetes">سكر</label>
                    <input
                      type="checkbox"
                      name="diabetes"
                      id="diabetes"
                      value={"سكر"}
                    />
                  </div>
                  <div className="sick-container">
                    <label htmlFor="highBloodPressure">ضغط</label>
                    <input
                      type="checkbox"
                      name="highBloodPressure"
                      value="ضغط"
                      id="highBloodPressure"
                    />
                  </div>
                  <div className="sick-container">
                    <label htmlFor="smoker">مدخن</label>
                    <input
                      type="checkbox"
                      name="smoker"
                      id="smoker"
                      value="تدخين"
                    />
                  </div>
                </div>
              </div>
              <div className="more-sicks">
                <label htmlFor="anotherSick">
                  هل يوجد أمراض أخرى؟اذكرها. (فى حالة وجود اكثر من مرض يرجى ضغط
                  مسافة مرتين بين الواحد و الآخر)
                </label>
                <input
                  type="text"
                  name="anotherSick"
                  id="anotherSick"
                  className="form-control"
                />
              </div>
              <div className="surgery-operations">
                <label htmlFor="surgeryOperations">
                  هل أجريت عملية جراحية فى العام السابق؟ ماهى. (فى حالة وجود
                  اكثر من عملية يرجى ضغط مسافة مرتين بين الواحدة و الأخرى)
                </label>
                <input
                  type="text"
                  name="surgeryOperations"
                  id="surgeryOperations"
                  className="form-control"
                />
              </div>
              <div className="allergy">
                <label htmlFor="patientAllergy">
                  هل لديك حساسية من أى شئ؟ اذكره. (فى حالة وجود اكثر من شئ يرجى
                  ضغط مسافة مرتين بين الواحد و الأخر)
                </label>
                <input
                  type="text"
                  name="patientAllergy"
                  id="patientAllergy"
                  className="form-control"
                />
              </div>
              <div className="opinion">
                <label htmlFor="patientOpinion">ليه اخترت آراك؟</label>
                <input
                  type="text"
                  name="patientOpinion"
                  id="patientOpinion"
                  className="form-control"
                />
              </div>
            </div>
            <div className="next-visits">
              <h4 className="title">حجز زيارة:-</h4>
              <div className="content">
                <div className="reason">
                  <label htmlFor="illness">سبب الزيارة</label>
                  <Select name="illness" id="illness" options={services} />
                  {/* <select
                    className="form-control w-auto"
                    name="illness"
                    id="illness"
                  >
                    <option value="" disabled>
                      ---اختر---
                    </option>
                    <option value="أشعة عادية">أشعة عادية</option>
                    <option value="حشو بلاتين">حشو بلاتين</option>
                    <option value="حشو كمبوزت">حشو كمبوزت</option>
                    <option value="حشو عصب">حشو عصب</option>
                    <option value="حشو عادى أطفال">حشو عادى أطفال</option>
                    <option value="حشو عصب أطفال">حشو عصب أطفال</option>
                    <option value="طاقم متحرك">طاقم متحرك</option>
                    <option value="زراعة">زراعة</option>
                    <option value="خلع عادي">خلع عادي</option>
                    <option value="خلع ضرس عقل">خلع ضرس عقل</option>
                    <option value="خلع ضرس عقل مدفون">خلع ضرس عقل مدفون</option>
                    <option value="طربوش">طربوش</option>
                    <option value="كوبري">كوبري</option>
                    <option value="تنظيف جير">تنظيف جير</option>
                    <option value="تلميع">تلميع</option>
                    <option value="تبييض">تبييض</option>
                    <option value="علاج">علاج</option>
                  </select> */}
                </div>
                <div className="visit-date">
                  <label htmlFor="visitDate">تاريخ الزيارة</label>
                  <DatePicker
                    id="visitDate"
                    name="visitDate"
                    openTo="month"
                    views={["year", "month", "day"]}
                  />
                </div>
                <div className="visit-time">
                  <label htmlFor="visitTime">موعد الزيارة</label>
                  {/* <input
                    className="form-control w-auto"
                    type="time"
                    id="visitTime"
                    name="visitTime"
                  /> */}
                  <MobileTimePicker views={["hours", "minutes"]} />
                </div>
                <div className="first-time">
                  <label htmlFor="firstTime">
                    هل هذه أول زيارة لنفس المرض؟
                  </label>
                  <input
                    className="mx-2"
                    type="checkbox"
                    id="firstTime"
                    name="firstTime"
                  />
                </div>
              </div>
            </div>
            <button type="submit">تسجيل</button>
          </form>
        </div>
      </div>
    </>
  )
}
