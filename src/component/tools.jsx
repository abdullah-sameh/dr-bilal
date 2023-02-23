export function undo(dispatch) {
  dispatch({
    type: "setInfoClass",
    payload: "animate__backOutLeft",
  })
  dispatch({
    type: "setNameClass",
    payload: "animate__backInRight",
  })

  setTimeout(() => {
    dispatch({
      type: "setName",
      payload: "true",
    })
    dispatch({
      type: "setInfo",
      payload: false,
    })
  }, 250)
}

export function next(dispatch) {
  dispatch({
    type: "setNameClass",
    payload: "animate__backOutRight",
  })
  dispatch({
    type: "setInfoClass",
    payload: "animate__backInLeft",
  })

  setTimeout(() => {
    dispatch({
      type: "setInfo",
      payload: "true",
    })
    dispatch({
      type: "setName",
      payload: false,
    })
  }, 250)
}

export function getPercentage(numbers) {
  const fac = 100 / numbers.reduce((a, b) => a + b, 0)
  let percentage = numbers.map((ele) => ele * fac)
  let sums = 0
  percentage = percentage.map((ele, i) => {
    sums += ele
    return sums
  })
  return percentage
}

export function fillColors(percentage, colors) {
  let finish = ""
  for (let i = 0; i < percentage.length; i++) {
    if (i === 0) {
      finish = `${colors[i]} ${percentage[i]}%,`
    } else if (i === percentage.length - 1) {
      finish += `${colors[i]} ${percentage[i - 1]}%)`
    } else {
      finish += `${colors[i]} ${percentage[i - 1]}%,`
      finish += `${colors[i]} ${percentage[i]}%`
      i === percentage.length - 1 ? (finish += ")") : (finish += ",")
    }
  }
  return finish
}
