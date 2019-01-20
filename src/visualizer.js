const canvas = document.querySelector('canvas')
const canvasCtx = canvas.getContext('2d')

let centrX, centrY, endX, endY, barHeight, rads, x, y, bars, barWidth, radius, barHeightMultipler
let width = window.innerWidth
let height = window.innerHeight

let mousePos = {
  x: 0,
  y: 0
}

function visualization (freqArr) {
  _setInitlials()
  _canvasSetup()
  centrX = width / 2
  centrY = height / 2
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
  canvasCtx.beginPath()
  canvasCtx.stroke()
  for (let i = 0; i < bars; i++) {
    rads = Math.PI * 2 / bars
    barHeight = freqArr[i] * barHeightMultipler
    x = centrX + Math.cos(rads * i) * (radius)
    y = centrY + Math.sin(rads * i) * (radius)
    endX = centrX + Math.cos(rads * i) * (radius + barHeight)
    endY = centrY + Math.sin(rads * i) * (radius + barHeight)
    drawBar(x, y, endX, endY, barWidth, freqArr[i])
  }
}

function _canvasSetup () {
  canvas.width = width
  canvas.height = height

  window.addEventListener('resize', () => {
    _setInitlials()
  })

  canvas.addEventListener('mousemove', (evt) => {
    mousePos.x = evt.clientX
    mousePos.y = evt.clientY
  })

  document.getElementById('info').classList.remove('novisible')
}

function drawBar (x1, y1, x2, y2, width, frequency) {
  const lineColor = `rgb(${mousePos.x / 5},${mousePos.y / 5},${frequency})`

  canvasCtx.strokeStyle = lineColor
  canvasCtx.lineWidth = width
  canvasCtx.beginPath()
  canvasCtx.moveTo(x1, y1)
  canvasCtx.lineTo(x2, y2)
  canvasCtx.stroke()
}

function getMouseRelPos () {
  return {
    x: mousePos.x - width / 2,
    y: mousePos.y
  }
}

function _setInitlials () {
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
  if (width < 500) {
    bars = 50
    barWidth = 5
    radius = 20
    barHeightMultipler = 0.5
  } else {
    bars = 100
    barWidth = 10
    radius = 100
    barHeightMultipler = 1.5
  }
}

export { visualization, getMouseRelPos }
