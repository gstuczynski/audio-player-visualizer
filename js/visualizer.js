const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
let mousePos = {x: 0, y: 0};

var ctx, center_x, center_y, radius, bars, 
x_end, y_end, bar_height, bar_width,
frequency_array;
bars = 200;
bar_width = 5;

let width = window.innerWidth;
let height = window.innerHeight;
var colorPalette = ["#0f0639", "#ff006a", "#ff4f00", "#00f9d9"];
var pieces = 20;
var radius = 100;


const setupAudioNodes = () => {

  let javascriptNode = context.createScriptProcessor(2048, 1, 1);
  javascriptNode.connect(context.destination);

  analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;

  splitter = context.createChannelSplitter();
  sourceNode.connect(splitter);
  splitter.connect(analyser, 0, 0);
  analyser.connect(javascriptNode);
  sourceNode.connect(context.destination);


  javascriptNode.onaudioprocess = function () {

    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    console.log(mousePos)

    center_x = width / 2;
    center_y = height / 2;
    canvasCtx.clearRect(0,0,canvas.width,canvas.height);
    canvasCtx.beginPath();
    canvasCtx.stroke();
    //radius = array[0]
    for(var i = 0; i < bars; i++){
      //divide a circle into equal parts
      rads = Math.PI * 2 / bars;
      bar_height = array[i]*1.5;
      // set coordinates
      x = center_x + Math.cos(rads * i) * (radius);
      y = center_y + Math.sin(rads * i) * (radius);
      x_end = center_x + Math.cos(rads * i)*(radius + bar_height);
      y_end = center_y + Math.sin(rads * i)*(radius + bar_height);
      //draw a bar
      drawBar(x, y, x_end, y_end, bar_width,array[i]);
      }
  }


}

function drawBar(x1, y1, x2, y2, width,frequency){
    
  //var lineColor = "rgb(" + 255 + ", " + frequency + ", " + 0 + ")";
  var lineColor = `rgb(${mousePos.x/5},${mousePos.y/5},${frequency})`;

  
  canvasCtx.strokeStyle = lineColor;
  canvasCtx.lineWidth = width;
  canvasCtx.beginPath();
  canvasCtx.moveTo(x1,y1);
  canvasCtx.lineTo(x2,y2);
  canvasCtx.stroke();
}


const displayVisualizer = () => {
  playerInit.removeChild(playSample);
  playerInit.removeChild(dropArea);
  document.getElementById('controller').className = "controller"
  canvas.width = width;
  canvas.height = height;
}

canvas.addEventListener('mousemove', (evt) => {
  mousePos.x = evt.clientX;
  mousePos.y = evt.clientY;
})

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});