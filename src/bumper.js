module.exports = { bumper }

function bumper({
  dpi = 72,
  nX = 6,
  nY = 6,
  holeColor = "#0072B2",
  edgeColor = "#000"
}) {
  // mm to px
  const mm = (n) => n / 25.4 * dpi

  //// bumper dims ////
  const w = mm(12)
  const h = mm(8)

  //// stem hole dims ////
  const holeW = mm(1.2)
  const holeH = mm(3)
  const holeR = Math.min(holeW, holeH) * 0.25
  const holeD = mm(5.7)

  //// width of the tabs for holding parts in place ////
  const tabW = mm(0.4)
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
