const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

const setupAudioNodes = () => {

  let javascriptNode = context.createScriptProcessor(2048, 1, 1);
  javascriptNode.connect(context.destination);

  analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;

  analyser2 = context.createAnalyser();
  analyser2.smoothingTimeConstant = 0.0;
  analyser2.fftSize = 1024;

  splitter = context.createChannelSplitter();

  sourceNode.connect(splitter);

  splitter.connect(analyser, 0, 0);
  splitter.connect(analyser2, 1, 0);

  analyser.connect(javascriptNode);

  sourceNode.connect(context.destination);

  var gradient = canvasCtx.createLinearGradient(0, 0, width , height);
  gradient.addColorStop(1, '#000000');
  gradient.addColorStop(0.75, '#ff0000');
  gradient.addColorStop(0.25, '#ffff00');
  gradient.addColorStop(0, '#ffffff');

  javascriptNode.onaudioprocess = function () {

    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    console.log(array)

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = gradient;
    drawSpectrum(array);
  }

}

function drawSpectrum(array) {
  for (var i = 0; i < (array.length); i++) {
    var value = array[i];
    canvasCtx.fillRect(i * 5, height /2 - value, 3, 325);
  }
};


function getAverageVolume(array) {
  var values = 0;
  var average;
  var length = array.length;

  for (var i = 0; i < length; i++) {
    values += array[i];
  }

  average = values / length;
  return average;
}

const displayVisualizer = () => {
  playerInit.removeChild(playSample);
  playerInit.removeChild(dropArea);
  canvas.width = width;
  canvas.height = height;
}
