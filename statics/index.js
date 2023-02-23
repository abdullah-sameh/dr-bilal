const operations = [4, 5, 6]
const colors = ["red", "blue", "green"]
const sum = operations.reduce((a, b) => a + b, 0)

const fac = 100 / sum
const results = operations.map((ele) => ele * fac)

const container = document.getElementById("container")
console.log(container)
const style = `conic-gradient(${colors[0]} ${results[0]}%, ${colors[1]} ${results[0]}%, ${colors[1]} ${results[1]}%, ${colors[2]} ${results[1]}%)`

container.style.backgroundImage = style

const resultSpans = document.getElementById("results")
colors.forEach((color, i) => {
  resultSpans.innerHTML += `
  <span class=${color}>${i + 1} operation has: ${operations[i]}</span>
`
})
