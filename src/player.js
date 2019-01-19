import { Visualization } from './visualizer'

const context = new (AudioContext || webkitAudioContext)()

let sourceNode = context.createBufferSource()
sourceNode.connect(context.destination)
let isPlaying = false

const dropArea = document.getElementById('drop-area')
const playSampleBtn = document.getElementById('play-sample')

const playSound = (buffer) => {
  context.resume()
  sourceNode.buffer = buffer
  if (sourceNode.start) {
    sourceNode.start()
  } else sourceNode.noteOn(0)
  setAudioController()
  setupAudioNodes()
  isPlaying = true
}

playSampleBtn.addEventListener('click', () => {
  loadSound('media/sample.mp3').then(buff => playSound(buff))
})

const loadSound = (url) => {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then(res => context.decodeAudioData(res))
    .then(buff => buff)
}

function setupAudioNodes () {
  let javascriptNode = context.createScriptProcessor(2048, 1, 1)
  javascriptNode.connect(context.destination)

  let analyser = context.createAnalyser()
  analyser.smoothingTimeConstant = 0.3
  analyser.fftSize = 1024

  let splitter = context.createChannelSplitter()
  sourceNode.connect(splitter)
  splitter.connect(analyser, 0, 0)
  analyser.connect(javascriptNode)
  sourceNode.connect(context.destination)

  javascriptNode.onaudioprocess = () => {
    var freqArr = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(freqArr)
    Visualization(freqArr)
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
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = function () {
    context.decodeAudioData(reader.result)
      .then(buffer => playSound(buffer))
      .catch(err => console.log(err))
  }
}

function setAudioController () {
  const playerInit = document.getElementById('player-init')

  playerInit.removeChild(document.getElementById('sample-wrapper'))
  playerInit.removeChild(dropArea)

  document.getElementById('controller').className = 'controller'
  const playerBtn = document.getElementById('playerBtn')

  playerBtn.addEventListener('click', () => {
    if (isPlaying) {
      context.suspend()
      playerBtn.firstChild.className = 'glyphicon glyphicon-play'
    } else {
      context.resume()
      playerBtn.firstChild.className = 'glyphicon glyphicon-pause'
    }
    isPlaying = !isPlaying
  })
}
