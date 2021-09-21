class SketchClass {

  pitch = null
  
  constructor () {
    this.audioContext = new AudioContext();
    this.audio = document.getElementById('audio');
    this.setup();
  }

  setup () {
    this.audio.onplay = () => {
      const stream = audio.captureStream();
      this.startPitch(stream)
    }
    // this.audio.muted = true;
    this.audio.volume = 1;
    this.audio.play();
    console.log('soong played')
  }

  async startPitch (stream) {
    this.pitch = await ml5.pitchDetection('./model/', this.audioContext , stream, this.modelLoaded);
    this.listenPitch();
  }

  modelLoaded () {
    console.log('Model loaded');
  }

  listenPitch () {
    setInterval(() => {
      this.getPitch()
    }, 250)
  }

  getPitch () {
    this.pitch.getPitch(function(err, frequency) {
      console.log(frequency);
      return frequency;
    })
  }
}
