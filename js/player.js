const context = new(AudioContext || webkitAudioContext);
let isPlaying = false;

let sourceNode;
sourceNode = context.createBufferSource();
sourceNode.connect(context.destination);

const dropArea = document.getElementById('drop-area');
const playerInit = document.getElementById('player-init');
const playSample = document.getElementById('play-sample')

const loadSound = (url) => {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then(res => context.decodeAudioData(res))
    .then(buff => buff);
}

const playSound = (buffer) => {
  context.resume()
  isPlaying = true;

  sourceNode.buffer = buffer;
  if (sourceNode.start) {
    sourceNode.start();
  } else sourceNode.noteOn(0);
}

function onError(e) {
  console.log(e);
}

const playerBtn = document.getElementById('playerBtn');

playerBtn.addEventListener('click', () => {
  if(isPlaying){
    console.log(playerBtn.childNodes[0])
    context.suspend()
    playerBtn.firstChild.className = 'glyphicon glyphicon-play';
  }else {
    context.resume()
    playerBtn.firstChild.className = 'glyphicon glyphicon-pause';
  }
  isPlaying = !isPlaying;
});

playSample.addEventListener('click', () => {
  loadSound("media/sample.mp3").then(buff => playSound(buff));
  displayVisualizer();
});

window.onload = () => {
  setupAudioNodes();
}