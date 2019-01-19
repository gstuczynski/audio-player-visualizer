const canvas = document.querySelector('canvas')
const canvasCtx = canvas.getContext('2d')

let centrX, centrY, endX, endY, barHeight, rads, x, y

const bars = 200

const barWidth = 5

const radius = 100

let mousePos = {
  x: 0,
  y: 0
}

let width = window.innerWidth
let height = window.innerHeight

function Visualization (freqArr) {
  _CanvasSetup()
  centrX = width / 2
  centrY = height / 2
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
  canvasCtx.beginPath()
  canvasCtx.stroke()
  for (let i = 0; i < bars; i++) {
    rads = Math.PI * 2 / bars
    barHeight = freqArr[i] * 1.5
    x = centrX + Math.cos(rads * i) * (radius)
    y = centrY + Math.sin(rads * i) * (radius)
    endX = centrX + Math.cos(rads * i) * (radius + barHeight)
    endY = centrY + Math.sin(rads * i) * (radius + barHeight)
    drawBar(x, y, endX, endY, barWidth, freqArr[i])
  }
}

function _CanvasSetup () {
  canvas.width = width
  canvas.height = height

  window.addEventListener('resize', () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
  })

  canvas.addEventListener('mousemove', (evt) => {
    mousePos.x = evt.clientX
    mousePos.y = evt.clientY
  })
}

function drawBar (x1, y1, x2, y2, width, frequency) {
  var lineColor = `rgb(${mousePos.x / 5},${mousePos.y / 5},${frequency})`

  canvasCtx.strokeStyle = lineColor
  canvasCtx.lineWidth = width
  canvasCtx.beginPath()
  canvasCtx.moveTo(x1, y1)
  canvasCtx.lineTo(x2, y2)
  canvasCtx.stroke()
}

export { Visualization }
