import Select from "react-select";
import { DatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHref, useNavigate, useParams } from "react-router-dom";
import printLogo from "../../assets/colored_logo.png";
import adultMouth from "../../assets/adult_mouth.jpg";
import kidsMouth from "../../assets/kids_mouth.jpg";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase";
import { getPatientById } from "../../rtk/slices/patientSlice";
import { setUser } from "../../rtk/slices/userSlice";
import "./patientDetails.css";

const PatientDetails = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useHref();

  const patient = useSelector((state) => state.patientById);
  const [timeVisit, setTimeVisit] = useState(dayjs("none"));
  const [birthDate, setBirthDate] = useState(dayjs("none"));
  const [newBook, setNewBook] = useState(false);
  const [inDetails, setInDetails] = useState(false);
  const [inFillForm, setInFillForm] = useState(false);
  const [inEdit, setInEdit] = useState(false);
  const [patientInfo, setpatientInfo] = useState({});
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
    dispatch(getPatientById(patientId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  useEffect(() => {
    setpatientInfo(patient.data);
    setTimeVisit(
      dayjs()
        .hour(+patient?.data?.nextVisit?.visitTime?.split(":")[0])
        .minute(+patient?.data?.nextVisit?.visitTime?.split(":")[1])
    );
    setBirthDate(dayjs(patientInfo?.birthDate));
    url.includes("newBook") ? setNewBook(false) : setNewBook(true);
    url.includes("details") ? setInDetails(true) : setInDetails(false);
    url.includes("fillForm") ? setInFillForm(true) : setInFillForm(false);
    url.includes("editDate") ? setInEdit(true) : setInEdit(false);
  }, [patient]);

  const editInfo = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: `من أنك تريد تعديل بيانات ${patientInfo?.name}؟`,
      showDenyButton: true,
      confirmButtonText: "تأكيد",
      denyButtonText: `إالغاء`,
    }).then(async (result) => {
      /*Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(patientInfo);
        await setDoc(doc(db, "patients", patientId), {
          ...patientInfo,
          requiredMoney:
            patientInfo?.requiredMoney - patientInfo?.nextVisit?.paidUp,
        })
          .then(() => {
            dispatch(getPatientById(patientId));
            Swal.fire({
              position: "center",
              icon: "success",
              title: "تم التعديل بنجاح",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate(-1);
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

  const handleMouthByAge = (birthDate) => {
    let birthDt = new Date(birthDate);
    let currentDt = new Date();

    let age = currentDt.getFullYear() - birthDt.getFullYear();

    if (age >= 11) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="patient-info">
        <div className="container">
          <form
            onSubmit={editInfo}
            className="editPatientInfo d-flex flex-column gap-4 w-100"
          >
            <div className="header">
              <div className="logo">
                <img src={printLogo} alt="printedLogo" />
                <div>
                  <h1>آراك</h1>
                  <p className="fw-bold">د. بلال شعبان الزهيري</p>
                </div>
              </div>
              <h1 className="title">{patientInfo?.code}</h1>
            </div>
            {!inEdit && (
              <div className="main-info gap-3">
                <div className="name">
                  <label htmlFor="patientName">اسم العميل</label>
                  <input
                    type="text"
                    name="patientName"
                    id="patientName"
                    className="form-control"
                    value={patientInfo?.name || ""}
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        name: e.currentTarget.value,
                      });
                    }}
                    required
                  />
                </div>
                <div className="phone">
                  <label htmlFor="patientPhone">رقم الهاتف</label>
                  <input
                    type="text"
                    name="patientPhone"
                    id="patientPhone"
                    className="form-control"
                    value={patientInfo?.phone || ""}
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        phone: e.currentTarget.value,
                      });
                    }}
                    required
                  />
                </div>
                {newBook && (
                  <>
                    <div className="birth-date">
                      <label htmlFor="patientBirthDate">تاريخ الميلاد</label>
                      <DatePicker
                        name="patientBirthDate"
                        id="patientBirthDate"
                        className="form-control"
                        value={birthDate}
                        format="DD-MM-YYYY"
                        openTo="year"
                        onChange={(date) => {
                          setBirthDate(date);
                          setpatientInfo({
                            ...patientInfo,
                            birthDate: date.format("YYYY/MM/DD"),
                          });
                        }}
                        slotProps={{
                          textField: {
                            helperText:
                              "العمر: " + // currentAge =
                              dayjs(new Date()).diff(dayjs(birthDate), "year") +
                              (+dayjs(new Date()).get("year") -
                                +dayjs(birthDate).get("year") <
                              10
                                ? " أعوام"
                                : " عام"),
                          },
                        }}
                      />
                    </div>
                    <div className="job">
                      <label htmlFor="patientJob">الوظيفة</label>
                      <input
                        type="text"
                        name="patientJob"
                        id="patientJob"
                        className="form-control"
                        value={patientInfo?.job || ""}
                        onChange={(e) => {
                          setpatientInfo({
                            ...patientInfo,
                            job: e.currentTarget.value,
                          });
                        }}
                      />
                    </div>
                    <div className="adresse">
                      <label htmlFor="patientAdresse">العنوان</label>
                      <input
                        type="text"
                        name="patientAdresse"
                        id="patientAdresse"
                        className="form-control"
                        value={patientInfo?.adresse || ""}
                        onChange={(e) => {
                          setpatientInfo({
                            ...patientInfo,
                            adresse: e.currentTarget.value,
                          });
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {newBook && !inEdit && (
              <>
                <div className="d-flex justify-content-center flex-wrap gap-3">
                  <div className="marital-status flex-grow-1">
                    <h4 className="title">الحالة الاجتماعية</h4>
                    <div className="status-container">
                      <label htmlFor="unmarried">أعزب</label>
                      <input
                        type="radio"
                        name="socialStatus"
                        id="unmarried"
                        value={"unmarried"}
                        checked={
                          document.querySelector("#unmarried")?.value ===
                            patientInfo?.maritalStatus || false
                        }
                        onChange={(e) => {
                          e.currentTarget.checked &&
                            setpatientInfo({
                              ...patientInfo,
                              maritalStatus: e.currentTarget.value,
                            });
                        }}
                      />

                      <label htmlFor="married">متزوج</label>
                      <input
                        type="radio"
                        name="socialStatus"
                        id="married"
                        value={"married"}
                        checked={
                          document.querySelector("#married")?.value ===
                            patientInfo?.maritalStatus || false
                        }
                        onChange={(e) => {
                          e.currentTarget.checked &&
                            setpatientInfo({
                              ...patientInfo,
                              maritalStatus: e.currentTarget.value,
                            });
                        }}
                      />
                    </div>
                  </div>
                  <div className="pregnant-status flex-grow-1">
                    <h4 className="title">هل أنت؟</h4>
                    <div className="status-container">
                      <label htmlFor="pregnant">حامل</label>
                      <input
                        type="checkbox"
                        name="pregnant"
                        id="pregnant"
                        checked={patientInfo?.pregnant || false}
                        onChange={(e) =>
                          setpatientInfo({
                            ...patientInfo,
                            pregnant: e.currentTarget.checked,
                          })
                        }
                      />

                      <label htmlFor="breastfeeding">مرضعة</label>
                      <input
                        type="checkbox"
                        name="breastfeeding"
                        id="breastfeeding"
                        checked={patientInfo?.breastfeeding || false}
                        onChange={(e) =>
                          setpatientInfo({
                            ...patientInfo,
                            breastfeeding: e.currentTarget.checked,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="sick-history flex-grow-1">
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
                          checked={patientInfo?.popularSicks?.diabetes || false}
                          onChange={(e) =>
                            setpatientInfo({
                              ...patientInfo,
                              popularSicks: {
                                ...patientInfo.popularSicks,
                                diabetes: e.currentTarget.checked,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="sick-container">
                        <label htmlFor="highBloodPressure">ضغط</label>
                        <input
                          type="checkbox"
                          name="highBloodPressure"
                          value="ضغط"
                          id="highBloodPressure"
                          checked={
                            patientInfo?.popularSicks?.highBloodPressure ||
                            false
                          }
                          onChange={(e) =>
                            setpatientInfo({
                              ...patientInfo,
                              popularSicks: {
                                ...patientInfo.popularSicks,
                                highBloodPressure: e.currentTarget.checked,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="sick-container">
                        <label htmlFor="smoker">مدخن</label>
                        <input
                          type="checkbox"
                          name="smoker"
                          id="smoker"
                          value="تدخين"
                          checked={patientInfo?.popularSicks?.smoker || false}
                          onChange={(e) =>
                            setpatientInfo({
                              ...patientInfo,
                              popularSicks: {
                                ...patientInfo.popularSicks,
                                smoker: e.currentTarget.checked,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="more-sicks">
                  <label htmlFor="anotherSick">
                    هل يوجد أمراض أخرى؟اذكرها. (فى حالة وجود اكثر من مرض يرجى
                    ضغط مسافة مرتين بين الواحد و الآخر)
                  </label>
                  <input
                    type="text"
                    name="anotherSick"
                    id="anotherSick"
                    className="form-control"
                    value={patientInfo?.otherSicks?.join("  ") || ""}
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        otherSicks: e.currentTarget.value
                          .toString()
                          .split("  "),
                      });
                    }}
                  />
                </div>
                <div className="surgery-operations">
                  <label htmlFor="surgeryOperations">
                    إذا أجريت عملية فالعام السابق، اذكرها. (فى حالة وجود اكثر من
                    عملية يرجى ضغط مسافة مرتين بين الواحدة و الأخرى)
                  </label>
                  <input
                    type="text"
                    name="surgeryOperations"
                    id="surgeryOperations"
                    className="form-control"
                    value={
                      patientInfo?.previousSurgeryOperations?.join("  ") || ""
                    }
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        previousSurgeryOperations: e.currentTarget.value
                          .toString()
                          .split("  "),
                      });
                    }}
                  />
                </div>
                <div className="allergy">
                  <label htmlFor="patientAllergy">
                    هل لديك حساسية من أى شئ؟ اذكره. (فى حالة وجود اكثر من شئ
                    يرجى ضغط مسافة مرتين بين الواحد و الأخر)
                  </label>
                  <input
                    type="text"
                    name="patientAllergy"
                    id="patientAllergy"
                    className="form-control"
                    value={patientInfo?.allergy?.join("  ") || ""}
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        allergy: e.currentTarget.value.toString().split("  "),
                      });
                    }}
                  />
                </div>
                <div className="opinion">
                  <label htmlFor="patientOpinion">ليه اخترت آراك؟</label>
                  <input
                    type="text"
                    name="patientOpinion"
                    id="patientOpinion"
                    className="form-control"
                    value={patientInfo?.opinion || ""}
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        opinion: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
              </>
            )}
            {patientInfo?.previousVisits?.length !== 0 && (
              <div className="previous-visits">
                <h4 className="title">الزيارات السابقة:-</h4>
                <table className="previous-visits table table-striped w-lg-100 w-md-auto">
                  <thead>
                    <tr>
                      <td>السبب</td>
                      <td>التاريخ</td>
                      <td>الموعد</td>
                      <td>المبلغ المدفوع</td>
                    </tr>
                  </thead>
                  <tbody>
                    {patientInfo?.previousVisits?.map((visit, index) => (
                      <tr key={index}>
                        <td>{visit?.reason}</td>
                        <td>
                          {visit?.visitDate} --- (
                          {weekDays[dayjs(visit?.visitDate).day()]})
                        </td>
                        <td style={{ direction: "ltr", textAlign: "end" }}>
                          {dayjs()
                            .hour(parseInt(visit?.visitTime?.split(":")[0]))
                            .minute(parseInt(visit?.visitTime?.split(":")[1]))
                            .format("hh:mm A")}
                        </td>
                        <td>{visit?.paidUp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(!newBook || inEdit) && (
              <div className="next-visits">
                <h4 className="title">الزيارة القادمة:-</h4>
                <div className="content gap-3">
                  <div className="reason" style={{ flexBasis: "200px" }}>
                    <label htmlFor="illness">سبب الزيارة</label>

                  <Select
                    labelId="illness"
                    id="demo-controlled-open-select"
                    value={
                      {
                        value: patientInfo?.nextVisit?.reason,
                        label: patientInfo?.nextVisit?.reason,
                      } || "بتنجان مخلل"
                    }
                    onChange={(e) => {
                      setpatientInfo({
                        ...patientInfo,
                        nextVisit: {
                          ...patientInfo?.nextVisit,
                          reason: e.value,
                        },
                      });
                    }}
                    options={services}
                  />
                </div>
                <div className="visit-time">
                  <label htmlFor="visitTime">موعد الزيارة</label>
                  <MobileTimePicker
                    className="form-control w-auto"
                    id="visitTime"
                    name="visitTime"
                    views={["hours", "minutes"]}
                    value={timeVisit}
                    onChange={(time) => {
                      setTimeVisit(time);
                      setpatientInfo({
                        ...patientInfo,
                        nextVisit: {
                          ...patientInfo?.nextVisit,
                          visitTime: `${time.get("hour")}:${time.get(
                            "minute"
                          )}`,
                        },
                      });
                    }}
                    slotProps={{
                      textField: {
                        helperText: "HH:MM aa",
                      },
                    }}
                  />
                </div>
                <div className="visit-date">
                  <label htmlFor="visitDate">تاريخ الزيارة</label>
                  <DatePicker
                    id="visitDate"
                    name="visitDate"
                    value={dayjs(patientInfo?.nextVisit?.visitDate)}
                    onChange={(date) =>
                      setpatientInfo({
                        ...patientInfo,
                        nextVisit: {
                          ...patientInfo?.nextVisit,
                          visitDate: date.format("YYYY-MM-DD"),
                        },
                      })
                    }
                    views={["year", "month", "day"]}
                    openTo="month"
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        helperText:
                          "DD / MM / YYYY -- " +
                          weekDays[
                            dayjs(patientInfo?.nextVisit?.visitDate)?.day()
                          ],
                      },
                    }}
                    disablePast
                  />
                </div>
              </div>
            </div>
            <button className="align-self-start" type="submit">
              {setBtns(inDetails, inEdit, inFillForm)}
            </button>
          </form>
        </div>
      </div>

      {/* //printed paper */}
      <div className="d-none printed-paper">
        <div className="container">
          <div className="header">
            <div className="logo">
              <img src={printLogo} alt="printedLogo" />
              <div>
                <h1>آراك</h1>
                <p className="fw-bold">د. بلال شعبان الزهيري</p>
              </div>
            </div>
            <h1 className="title">{patientInfo?.code}</h1>
          </div>
          <div className="main-data">
            <div className="row">
              <div className="col-6">
                <h5 className="name">الاسم: {patientInfo?.name}</h5>
                <h5 className="birthDate">
                  تاريخ الميلاد: {patientInfo?.birthDate}
                </h5>
                <h5 className="phone">رقم الهاتف: {patientInfo?.phone}</h5>
                {patientInfo?.otherSicks?.length !== [""] &&
                (patientInfo?.popularSicks?.highBloodPressure ||
                  patientInfo?.popularSicks?.diabetes ||
                  patientInfo?.popularSicks?.smoker) ? (
                  <h5 className="sicks">
                    التاريخ المرضى:{" "}
                    {patientInfo?.otherSicks?.join(" , ") +
                      (patientInfo?.popularSicks?.highBloodPressure
                        ? " , ضغط"
                        : "") +
                      (patientInfo?.popularSicks?.smoker ? " , مدخن" : "") +
                      (patientInfo?.popularSicks?.diabetes ? " , سكر" : "")}
                  </h5>
                ) : (
                  <></>
                )}
                <h5 className="job">الوظيفة: {patientInfo?.job}</h5>
              </div>
              <div className="col-6">
                <div className="mouth">
                  <img
                    src={
                      handleMouthByAge(patientInfo?.birthDate)
                        ? adultMouth
                        : kidsMouth
                    }
                    alt="mouth-img"
                  />
                </div>
              </div>
            </div>
          </div>
          <table className="table h-100  table-bordered">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>التشخيص</th>
                <th>العلاج المتبع</th>
                <th>التكلفة</th>
                <th>الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((row, index) => (
                <tr key={index}>
                  <td>
                    /&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    /
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PatientDetails;

function setBtns(inDetails, inEdit, inFillForm) {
  if (inDetails || inEdit) {
    return "تعديل";
  } else if (inFillForm) {
    return "أكمل البيانات";
  } else {
    return "احجز";
  }
}
