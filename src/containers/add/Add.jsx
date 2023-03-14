import "./add.css";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
  const [selectedTime, setSelectedTime] = useState(dayjs('none'));
  const [visitReason, setVisitReason] = useState();

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
              paidUp:
                formData?.paidUp.value !== "" ? formData?.paidUp.value : 0,
            }
          : {},
      opinion: formData?.patientOpinion?.value,
      requiredMoney:
        formData?.paidUp.value !== ""
          ? formData?.requiredMoney.value - formData?.paidUp.value
          : formData?.requiredMoney.value,
      notes: formData?.notes?.value,
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
                <div className="none">
                  <div className="paid-up">
                    <label htmlFor="paidUp">المبلغ المدفوع</label>
                    <input
                      type="number"
                      name="paidUp"
                      id="paidUp"
                      min={0}
                      className="form-control"
                    />
                  </div>
                  <div className="required-money">
                    <label htmlFor="requiredMoney">المبلغ المطلوب دفعه</label>
                    <input
                      type="number"
                      id="requiredMoney"
                      name="requiredMoney"
                      min={0}
                      className="form-control"
                    />
                  </div>
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
          </form>
        </div>
      </div>
    </>
  )
}
