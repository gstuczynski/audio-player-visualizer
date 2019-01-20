import { visualization, getMouseRelPos } from './visualizer'
import './style.css'

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = window.audioCtx = new AudioContext()

let mousePos = { x: 0, y: 0 }

const posX = window.innerWidth / 2
const posY = window.innerHeight / 2
const posZ = 300

const panner = new PannerNode(audioCtx, {
  panningModel: 'HRTF',
  distanceModel: 'linear',
  positionX: posX,
  positionY: posY,
  positionZ: posZ,
  orientationX: 0.0,
  orientationY: 0.0,
  orientationZ: -1.0,
  refDistance: 1,
  maxDistance: 5000,
  rolloffFactor: 10,
  coneInnerAngle: 40,
  coneOuterAngle: 50,
  coneOuterGain: 0.4
})

let sourceNode = audioCtx.createBufferSource()
let isPlaying = false

const dropArea = document.getElementById('drop-area')
const playSampleBtn = document.getElementById('play-sample')

const playSound = (buffer) => {
  audioCtx.resume()
  sourceNode.buffer = buffer
  if (sourceNode.start) {
    sourceNode.start()
  } else sourceNode.noteOn(0)
  setAudioController()
  setupAudioNodes()
  isPlaying = true
  isLoading(false)
}

playSampleBtn.addEventListener('click', () => {
  loadSound('./media/sample.mp3').then(buff => playSound(buff))
})

const loadSound = (url) => {
  isLoading(true)
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then(res => audioCtx.decodeAudioData(res))
    .then(buff => buff)
}

function setupAudioNodes () {
  let javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1)
  javascriptNode.connect(audioCtx.destination)

  let analyser = audioCtx.createAnalyser()
  analyser.smoothingTimeConstant = 0.3
  analyser.fftSize = 1024

  let splitter = audioCtx.createChannelSplitter()
  sourceNode.connect(splitter)
  splitter.connect(analyser, 0, 0)
  analyser.connect(javascriptNode)

  sourceNode.connect(panner).connect(audioCtx.destination)
  sourceNode.loop = true

  javascriptNode.onaudioprocess = () => {
    let freqArr = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(freqArr)
    visualization(freqArr)
    mousePos = getMouseRelPos()
    panner.positionX.value = mousePos.x * 5
    panner.positionY.value = mousePos.y
  }
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight')
    , false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false)
})

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop (e) {
  let dt = e.dataTransfer
  let file = dt.files[0]
  if (file.type !== 'audio/mp3') {
    alert(`${file.type} i not supported, plese put mp3 file`)
    return
  }
  isLoading(true)

  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = function () {
    audioCtx.decodeAudioData(reader.result)
      .then(buffer => playSound(buffer))
      .catch(err => console.log(err))
  }
}

function setAudioController () {
  document.getElementById('controller').className = 'controller'
  const playerBtn = document.getElementById('playerBtn')

  playerBtn.addEventListener('click', () => {
    if (isPlaying) {
      audioCtx.suspend()
      playerBtn.firstChild.className = 'glyphicon glyphicon-play'
    } else {
      audioCtx.resume()
      playerBtn.firstChild.className = 'glyphicon glyphicon-pause'
    }
    isPlaying = !isPlaying
  })
}

function isLoading (isLoading) {
  const spinner = document.getElementById('spinner')
  if (isLoading) {
    const playerInit = document.getElementById('player-init')
    playerInit.removeChild(document.getElementById('sample-wrapper'))
    playerInit.removeChild(dropArea)
    spinner.className = 'spinner'
  } else {
    spinner.className = 'novisible'
  }
}
