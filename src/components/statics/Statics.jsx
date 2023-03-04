import "./statics.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatistics } from "../../rtk/slices/statistcsSlice";

export default function Statics() {
  const dispatch = useDispatch();

  const statistics = useSelector((state) => state?.statistics);

  useEffect(() => {
    dispatch(getStatistics());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيه",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوير",
    "نوفمبر",
    "ديسمبر",
  ];

  //options for highCharts
  let options = {
    chart: {
      type: "column",
      height: 600,
      width: 990,
    },

    title: {
      text: `${statistics?.year} Statistics`,
    },
    xAxis: {
      categories: months,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Patients Number",
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
      },
    },
    series: statistics?.illnesses,
  };

  return (
    <div className="container static">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="data-table">
        <table className="statistics-table table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              {months.map((month, ind) => (
                <th key={ind}>{month}</th>
              ))}
              <th>الإجمالى</th>
            </tr>
          </thead>
          <tbody>
            {statistics?.illnesses?.map((illness, index) => (
              <tr key={index}>
                <th>{illness?.name}</th>
                {illness?.data?.map((monthPatientsNumber, index) => (
                  <td key={index}>{monthPatientsNumber}</td>
                ))}
                <th>
                  {illness?.data?.reduce(
                    (acc, monthPatientsNumber) => acc + monthPatientsNumber,
                    0
                  )}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
