import "./add.css";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { useReducer } from "react";
// import { next, undo } from "../../components/tools";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setUser } from "../../rtk/slices/userSlice";
import { motion } from "framer-motion";
import { addDoc, collection, getDoc, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import Select from "react-select";
import { MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function Add() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [visitReason, setVisitReason] = useState();

  const [whatsCheck, setWhatsCheck] = useState([false, ""]);
  const weekDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
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
    { value: "تقويم", label: "تقويم" },
  ];
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

  const handlePatientData = async (e) => {
    e.preventDefault();
    let formData = e.target;
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
              reason: visitReason.value,
              visitTime: `${selectedTime.get("hour")}:${selectedTime.get(
                "minute"
              )}`,
              visitDate: selectedDate?.format("YYYY-MM-DD"),
              firstTime: true,
              paidUp: 0,
            }
          : {},
      opinion: formData?.patientOpinion?.value,
    };

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
            let dt = new Date();

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
                });
                setDoc(doc(db, "patients", "patientsCode"), {
                  currentNumber: docu.data().currentNumber + 1,
                })
                  .then(() => document.querySelector(".addNewPatient").reset())
                  .catch((e) => {
                    console.log(e.message);
                    Swal.fire({
                      icon: "error",
                      title: "خطأ",
                      text: "حاول مرة أخرى!",
                    });
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
      <div className="add">
        <div className="container">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="page-title"
          >
            <h1>أضف عميل جديد</h1>
          </motion.div>
          <form onSubmit={handlePatientData} className="addNewPatient">
            <div className="main-info">
              <div className="name">
                <label htmlFor="patientName">اسم العميل</label>
                <input
                  type="text"
                  name="patientName"
                  id="patientNameField"
                  className="form-control"
                  required
                />
              </div>
              <div className="phone">
                <label htmlFor="patientPhone">رقم الهاتف</label>
                <input
                  type="tel"
                  name="patientPhone"
                  id="patientPhoneField"
                  className="form-control"
                  required
                />
              </div>
              <div
                className="whatsapp-check d-flex align-items-center"
                style={{ minWidth: "fit-content" }}
              >
                <label htmlFor="whats">
                  <svg
                    fill={!whatsCheck[0] ? "#000" : "green"}
                    className={"animate__animated " + whatsCheck[1]}
                    height="40px"
                    width="40px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 308 308"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g id="XMLID_468_">
                        {" "}
                        <path
                          id="XMLID_469_"
                          d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"
                        ></path>{" "}
                        <path
                          id="XMLID_470_"
                          d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"
                        ></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </label>
                <input
                  type="checkbox"
                  name="whats"
                  id="whats"
                  onChange={() =>
                    whatsCheck[0]
                      ? setWhatsCheck([false, ""])
                      : setWhatsCheck([true, "animate__rubberBand"])
                  }
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
                  <Select
                    name="illness"
                    id="illness"
                    options={services}
                    value={visitReason}
                    onChange={(reason) => setVisitReason(reason)}
                  />
                </div>
                <div className="visit-date">
                  <label htmlFor="visitDate">تاريخ الزيارة</label>
                  <DatePicker
                    id="visitDate"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    views={["year", "month", "day"]}
                    openTo="month"
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        helperText:
                          "DD / MM / YYYY -- " + weekDays[selectedDate?.day()],
                      },
                    }}
                  />
                </div>
                <div className="visit-time">
                  <label htmlFor="visitTime">موعد الزيارة</label>
                  <MobileTimePicker
                    className="form-control w-auto"
                    id="visitTime"
                    name="visitTime"
                    views={["hours", "minutes"]}
                    value={selectedTime}
                    onChange={(time) => setSelectedTime(time)}
                    slotProps={{
                      textField: {
                        helperText: "HH:MM aa",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="notes">
              <div className="notes">
                <label htmlFor="notes">ملاحظات أخرى</label>
                <textarea
                  id="notes"
                  className="form-control"
                  name="notes"
                ></textarea>
              </div>
            </div>
            <button type="submit">تسجيل</button>

            <button
              className="whats-btn"
              type="button"
              onClick={() => {
                const name =
                  document.getElementById("#patientNameField")?.value;
                const phone =
                  document.getElementById("#patientPhoneField")?.value;
                const date = selectedDate;
                const time = selectedTime;
                const message = `لقد تم حجز معاد باسم: ${name}%0aبمعاد: ${date.format(
                  "DD/MM/YYYY"
                )}%0aالساعة: ${time.format("hh:mm a")}`;

                const whatsappurl = `https://wa.me/201026227264?text=${message}`;
                console.log(phone);
                window.open(whatsappurl, "_blank").focus();
              }}
            >
              ارسل وتساب
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
