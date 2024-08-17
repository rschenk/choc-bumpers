module.exports = { ambientBumper, chocBumper }

// mm to px
const to_mm = (dpi) => (n) => n / 25.4 * dpi

const dims_mm = ({w, h}, dpi) => ({w: to_mm(dpi)(w), h: to_mm(dpi)(h)})

function ambientBumper(opts) {
  const {dpi} = opts
  //// bumper dims ////
  const dims = dims_mm({
    w: 8.7,
    h: 4.2
  }, dpi)
  return bumper({...opts, ...dims})
}

function chocBumper(opts) {
  const {dpi} = opts
  //// bumper dims ////
  const dims = dims_mm({
    w: 12,
    h: 8
  }, dpi)
  return bumper({...opts, ...dims})
}

function bumper({
  dpi = 72,
  nX = 6,
  nY = 6,
  w, // bumper width
  h, // bumper height
  holeColor = "#000000",
  edgeColor = "#0072B2"
}) {
  // curry mm function
  const mm = to_mm(dpi)

  //// stem hole dims ////
  const holeW = mm(1.1)
  const holeH = mm(2.9)
  const holeR = Math.min(holeW, holeH) * 0.25
  const holeD = mm(5.7)

  //// width of the tabs for holding parts in place ////
  const tabW = mm(0.3)
  const tabHalf = tabW / 2

  //// layout for the main svg file ////
  const svgPadding = mm(5)
  const svgW = nX * w + svgPadding * 2
  const svgH = nY * h + svgPadding * 2

  //// drawing functions ////
  // don't need ridiculous subpixel precision
  const f = (n) => n.toFixed(2)
  // hole centered on coordinate
  const hole = (x, y) => `<rect x="${f(x - holeW / 2)}" y="${f(y - holeH / 2)}" width="${f(holeW)}" height="${f(holeH)}" rx="${f(holeR)}" style="fill: none; stroke: ${holeColor}" />`
  // pair of holes, centered on coordinate
  const holePair = (x, y) => `<g>${hole(x - holeD / 2, y)}${hole(x + holeD / 2, y)}</g>`
  // draw a line
  const line = ([x1, y1], [x2, y2]) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${edgeColor}" />`
  // generate pairs of coordinates for each bumper
  const coords = (numX, numY) => Array
    .from({length: numY}, (_, y) => y)
    .flatMap((y) => Array.from({length: numX}, (_, x) => [x, y]) )
    .map(([x, y]) => [x * w, y * h])

  //////////////////////////////////////
  ////                              ////
  //// the actual work is done here ////
  ////                              ////
  //////////////////////////////////////
  const horizontalLines = coords(nX, nY + 1)
    .map(([x, y]) => line([x + tabHalf, y], [x + w - tabHalf, y]))

  const verticalLines = coords(nX + 1, nY)
    .map(([x, y]) => line([x, y + tabHalf], [x, y + h - tabHalf]))

  const holes = coords(nX, nY)
    .map(([x, y]) => [x + w / 2, y + h / 2]) // locate the center
    .map(([x, y]) => holePair(x, y))

  return `
<svg viewbox="0 0 ${f(svgW)} ${f(svgH)}"
     width="${f(svgW)}"
     height="${f(svgH)}"
     xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${f(svgPadding)}, ${f(svgPadding)})">
    ${horizontalLines.join("\n    ")}

    ${verticalLines.join("\n    ")}

    ${holes.join("\n    ")}
  </g>
</svg>
    `
}
