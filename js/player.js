const context = new(AudioContext || webkitAudioContext);

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

  sourceNode.buffer = buffer;
  if (sourceNode.start) {
    sourceNode.start();
  } else sourceNode.noteOn(0);
}

function onError(e) {
  console.log(e);
}

document.getElementById('play').addEventListener('click', () => {
  context.resume()
});


playSample.addEventListener('click', () => {
  loadSound("media/sample.mp3").then(buff => playSound(buff));
  displayVisualizer();
});

document.getElementById('pause').addEventListener('click', () => {
  context.suspend()
});

window.onload = () => {
  setupAudioNodes();
}