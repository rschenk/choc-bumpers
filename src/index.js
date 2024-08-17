const { ambientBumper, chocBumper } = require("./bumper.js")
const fs = require("fs")

const layouts = [
  // 30 Keys
  {nX: 5, nY: 6},
  // 36 Keys
  {nX: 6, nY: 6},
  // 42 Keys
  {nX: 6, nY: 7},
  // 56 Keys
  {nX: 7, nY: 8},
]

const dpis = [{dpi: 72}, {dpi: 96}]

const filename = (prefix, {nX, nY, dpi}) => `${prefix}_bumper_${nX * nY}_keys@${dpi}dpi.svg`

layouts
  .flatMap((l) => dpis.map((d) => ({...l, ...d})))
  .forEach((o) => {
    fs.writeFileSync(filename("ambient", o), ambientBumper(o))
    fs.writeFileSync(filename("choc", o), chocBumper(o))
  })

