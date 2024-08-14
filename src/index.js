const { bumper } = require("./bumper.js")
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

const filename = ({nX, nY, dpi}) => `choc_bumper_${nX * nY}_keys@${dpi}dpi.svg`

layouts
  .flatMap((l) => dpis.map((d) => ({...l, ...d})))
  .forEach((o) => fs.writeFileSync(filename(o), bumper(o)))

