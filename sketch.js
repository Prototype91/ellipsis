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
    // this.audio.volume = 0.001;
    this.audio.play();
    this.audio.addEventListener('ended', () => {
      setTimeout(() => {
        console.log('ended');
        const score = getScore();
        let rank = 'F';
        if (score.percent >= 95) {
          rank = 'S';
        } else if(score.percent >= 90) {
          rank = 'A';
        } else if (score.percent >= 80) {
          rank = 'B';
        } else if(score.percent >= 70) {
          rank = 'C'
        } else if (score.percent >= 60) {
          rank = 'D';
        }
        
        document.getElementById('rank').innerHTML = rank;
        document.getElementById('notes-succeed').innerHTML = score.succeed;
        document.getElementById('notes-failed').innerHTML = score.failed;
        document.getElementById('notes-total').innerHTML = score.total;
        document.getElementById('percent').innerHTML = score.percent + '%';
        document.getElementById('score-container').style.display = 'block';
        document.getElementById("myModal").style.display = 'block';
        // audioClone.remove()
      }, 1500)
      
    })
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
