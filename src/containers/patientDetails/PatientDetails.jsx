import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPatientById } from "../../rtk/slices/patientSlice";
import "./patientDetails.css";

const PatientDetails = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();

  const patient = useSelector((state) => state.patientById);
  const [patientInfo, setpatientInfo] = useState({});

  useEffect(() => {
    dispatch(getPatientById(patientId));
  }, []);

  useEffect(() => {
    setpatientInfo(patient.data);
  }, [patient]);

  return (
    <div className="patient-info">
      <div className="container">
        <form className="editPatientInfo">
          <div className="main-info">
            <div className="name">
              <label htmlFor="patientName">اسم المريض</label>
              <input
                type="text"
                name="patientName"
                id="patientName"
                className="form-control"
                value={patientInfo?.name || ""}
                onChange={() => {}}
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
              <input type="checkbox" name="breastfeeding" id="breastfeeding" />
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
              هل أجريت عملية جراحية فى العام السابق؟ ماهى. (فى حالة وجود اكثر من
              عملية يرجى ضغط مسافة مرتين بين الواحدة و الأخرى)
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
              هل لديك حساسية من أى شئ؟ اذكره. (فى حالة وجود اكثر من شئ يرجى ضغط
              مسافة مرتين بين الواحد و الأخر)
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
          <div className="next-visits">
            <h4 className="title">حجز زيارة:-</h4>
            <div className="content">
              <div className="reason">
                <label htmlFor="illness">سبب الزيارة</label>
                <select
                  className="form-control w-auto"
                  name="illness"
                  id="illness"
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
                </select>
              </div>
              <div className="visit-time">
                <label htmlFor="visitTime">موعد الزيارة</label>
                <input
                  className="form-control w-auto"
                  type="time"
                  id="visitTime"
                  name="visitTime"
                  lang="ar-SA"
                />
              </div>
              <div className="visit-date">
                <label htmlFor="visitDate">تاريخ الزيارة</label>
                <input
                  className="form-control w-auto"
                  type="date"
                  id="visitDate"
                  name="visitDate"
                  lang="fr-CA"
                />
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
