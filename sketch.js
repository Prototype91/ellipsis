let audioContext;
let mic;
let pitch;

async function setup() {
  audioContext = new AudioContext();
  const video = document.createElement('VIDEO');
  video.onplay = function() {
    const stream = video.captureStream();
    startPitch(stream, audioContext);
  }

}
setup();

function startPitch(stream, audioContext) {
  pitch = ml5.pitchDetection('./model/', audioContext , stream, modelLoaded);
}

function modelLoaded() {
  document.querySelector('#status').textContent='Model Loaded';
  setInterval(() => {
    getPitch();
  }, 250);
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
      console.log(frequency);
      return frequency;
  })
}
