class SketchClass {

  pitch = null

  constructor() {
    this.audioContext = new AudioContext();
    this.audio = document.getElementById('audio');
    this.setup();
  }

  setup() {
    this.audio.onplay = () => {
      const stream = audio.captureStream();
      this.startPitch(stream)
    }
    this.audio.volume = 0.001;
    this.audio.play();
  }

  async startPitch(stream) {
    this.pitch = await ml5.pitchDetection('./model/', this.audioContext, stream, this.modelLoaded);
    this.listenPitch();
  }

  modelLoaded() {
    console.log('Model loaded');
  }

  listenPitch() {
    setInterval(() => {
      this.getPitch()
    }, 300)
  }

  async getPitch() {
    let isFrequency = false
    while (!isFrequency) {
      const frequency = await this.pitch.getPitch()
      if (frequency) {
        createBall(frequency)
        isFrequency = true
      }
    }

  }
}
