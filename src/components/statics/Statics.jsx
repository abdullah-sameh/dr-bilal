import { fillColors, getPercentage } from "../tools"
import "./statics.css"

export default function Statics() {
  const operationNumbers = [11, 5, 9, 10] // number of each operation
  const operationNames = ["حشو عادي", "حشو عصب", "خلع ضرس", "طربوش", "جراحة"]
  const colors = [
    "#267",
    "#a32",
    "#0d0",
    "#f93",
    "#8d8",
    "#0c0",
    "#30d",
    "#3b0",
    "#f49",
    "#390",
  ]

  const percentage = getPercentage(operationNumbers)


  return (
    <div className="container static">
      <div
        className="circle"
        style={{
          backgroundImage: "conic-gradient(" + fillColors(percentage, colors),
        }}
      />
      <div className="row-data">
        <ul>
          {operationNumbers.map((operationNumber, i) => {
            return (
              <li key={i}>
                <i style={{ backgroundColor: colors[i] }}></i>
                {operationNames[i]}: {operationNumber}{" "}
                {operationNumber > 10 ? "حالة" : "حالات"}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
