import { MenuItem } from "@mui/material";
import Select from "react-select";
import { DatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase";
import { getPatientById } from "../../rtk/slices/patientSlice";
import { setUser } from "../../rtk/slices/userSlice";
import "./patientDetails.css";

const PatientDetails = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patient = useSelector((state) => state.patientById);
  const [patientInfo, setpatientInfo] = useState({});
  const [reasonSelected, setReasonSelected] = useState();

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
  }, []);

  useEffect(() => {
    setpatientInfo(patient.data);
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
        await setDoc(doc(db, "patients", patientId), patientInfo)
          .then(() => {
            dispatch(getPatientById(patientId));
            Swal.fire({
              position: "center",
              icon: "success",
              title: "تم التعديل بنجاح",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate("../");
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
    <div className="patient-info">
      <div className="container">
        <form onSubmit={editInfo} className="editPatientInfo">
          <h4 onClick={() => navigate("../")} className="close">
            X
          </h4>
          <h2 className="patientCode">{patientInfo?.code}</h2>
          <div className="main-info">
            <div className="name">
              <label htmlFor="patientName">اسم المريض</label>
              <input
                type="text"
                disabled
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
              <label htmlFor="patientPhone">رقم الموبايل</label>
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
            <div className="birth-date">
              <label htmlFor="patientBirthDate">تاريخ الميلاد</label>
              <input
                type="date"
                name="patientBirthDate"
                id="patientBirthDate"
                className="form-control"
                value={patientInfo?.birthDate || ""}
                onChange={(e) => {
                  setpatientInfo({
                    ...patientInfo,
                    birthDate: e.currentTarget.value,
                  });
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
          </div>
          <div className="marital-status">
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
          <div className="pregnant-status">
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
                    patientInfo?.popularSicks?.highBloodPressure || false
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
              value={patientInfo?.otherSicks?.join("  ") || ""}
              onChange={(e) => {
                setpatientInfo({
                  ...patientInfo,
                  otherSicks: e.currentTarget.value.toString().split("  "),
                });
              }}
            />
          </div>
          <div className="surgery-operations">
            <label htmlFor="surgeryOperations">
              هل أجريت عملية جراحية فى العام السابق؟ ماهى. (فى حالة وجود اكثر من
              عملية يرجى ضغط مسافة مرتين بين الواحدة و الأخرى)
            </label>
            <input
              type="text"
              name="surgeryOperations"
              id="surgeryOperations"
              className="form-control"
              value={patientInfo?.previousSurgeryOperations?.join("  ") || ""}
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
              هل لديك حساسية من أى شئ؟ اذكره. (فى حالة وجود اكثر من شئ يرجى ضغط
              مسافة مرتين بين الواحد و الأخر)
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
          <div className="previous-visits my-5">
            <h4 className="title">الزيارات السابقة:-</h4>
            {patientInfo?.previousVisits?.length ? (
              <table className="previous-visits table table-striped w-lg-100 w-md-auto">
                <thead>
                  <tr>
                    <td>السبب</td>
                    <td>التاريخ</td>
                    <td>الموعد</td>
                  </tr>
                </thead>
                <tbody>
                  {patientInfo?.previousVisits?.map((visit, index) => (
                    <tr key={index}>
                      <td>{visit?.reason}</td>
                      <td>{visit?.visitDate}</td>
                      <td>{visit?.visitTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>لايوجد زيارات سابقة</p>
            )}
          </div>
          <div className="next-visits">
            <h4 className="title">الزيارة القادمة:-</h4>
            <div className="content">
              <div className="reason">
                <label htmlFor="illness">سبب الزيارة</label>

                <Select
                  labelId="illness"
                  id="demo-controlled-open-select"
                  onChange={(e) => {
                    console.log(e);
                    // console.log(reason);
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

                {/* <select
                  className="form-control w-auto"
                  name="illness"
                  id="illness"
                  value={patientInfo?.nextVisit?.reason || "أشعة عادية"}
                  onChange={(e) => {
                    setpatientInfo({
                      ...patientInfo,
                      nextVisit: {
                        ...patientInfo?.nextVisit,
                        reason: e.currentTarget.value,
                      },
                    });
                  }}
                >
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
              <div className="visit-time">
                <label htmlFor="visitTime">موعد الزيارة</label>
                <MobileTimePicker
                  className="form-control w-auto"
                  id="visitTime"
                  name="visitTime"
                  views={["hours", "minutes"]}
                  value={dayjs(new Date())
                    .hour(+patient?.data?.nextVisit?.visitTime?.split(":")[0])
                    .minute(
                      +patient?.data?.nextVisit?.visitTime?.split(":")[1]
                    )}
                  onChange={(time) =>
                    setpatientInfo({
                      ...patientInfo,
                      nextVisit: {
                        ...patientInfo?.nextVisit,
                        visitTime: time,
                      },
                    })
                  }
                  slotProps={{
                    textField: {
                      helperText: "HH:MM aa",
                    },
                  }}
                />
                {/* <input
                  className="form-control w-auto"
                  type="time"
                  id="visitTime"
                  name="visitTime"
                  value={patientInfo?.nextVisit?.visitTime || "00:00"}
                  onChange={(e) => {
                    setpatientInfo({
                      ...patientInfo,
                      nextVisit: {
                        ...patientInfo?.nextVisit,
                        visitTime: e.currentTarget.value,
                      },
                    })
                  }}
                /> */}
              </div>
              <div className="visit-date">
                <label htmlFor="visitDate">تاريخ الزيارة</label>
                <DatePicker
                  id="visitDate"
                  name="visitDate"
                  value={dayjs(new Date())
                    .date(+patientInfo?.nextVisit?.visitDate?.split("-")[2])
                    .month(
                      +patientInfo?.nextVisit?.visitDate?.split("-")[1] - 1
                    )
                    .year(+patientInfo?.nextVisit?.visitDate?.split("-")[0])}
                  onChange={(date) =>
                    setpatientInfo({
                      ...patientInfo,
                      nextVisit: {
                        ...patientInfo?.nextVisit,
                        visitDate: date,
                      },
                    })
                  }
                  views={["year", "month", "day"]}
                  openTo="month"
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      helperText: "DD / MM / YYYY",
                    },
                  }}
                />
                {/* <input
                  className="form-control w-auto"
                  type="date"
                  id="visitDate"
                  name="visitDate"
                  value={patientInfo?.nextVisit?.visitDate || ""}
                  onChange={(e) => {
                    setpatientInfo({
                      ...patientInfo,
                      nextVisit: {
                        ...patientInfo?.nextVisit,
                        visitDate: e.currentTarget.value,
                      },
                    })
                  }}
                /> */}
              </div>
            </div>
          </div>
          <button type="submit">تعديل</button>
        </form>
      </div>
    </div>
  );
};

export default PatientDetails;
