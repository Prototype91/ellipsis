class PlayerClass {

  pitch = null;
  rythm = new Rythm();
  game = null;
  interval = null;

  constructor(url) {
    this.audioContext = new AudioContext();
    this.audio = new Audio(url);
    this.rythm.setMusic(url);
  }

  start(game) {
    this.game = game;
    this.audio.onplay = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const stream_dest = ctx.createMediaStreamDestination();
      const source = ctx.createMediaElementSource(this.audio);
      source.connect(stream_dest);

      const stream = stream_dest.stream;
      this.startPitch(stream);
    }
    this.audio.play();
    this.rythm.start();

    this.audio.addEventListener('ended', () => {
      setTimeout(() => {
        const score = game.getScore();
        let rank = 'F';
        if (score.percent >= 95) {
          rank = 'S';
        } else if (score.percent >= 90) {
          rank = 'A';
        } else if (score.percent >= 80) {
          rank = 'B';
        } else if (score.percent >= 70) {
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
      }, 1000)

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
    console.log('listenPitch')
    this.interval = setInterval(() => {
      this.getPitch()
    }, 300)
  }

  stopMusic() {
    this.audio.pause();
  }

  async getPitch() {
    let isFrequency = false
    while (!isFrequency) {
      const frequency = await this.pitch.getPitch();
      if (frequency) {
        this.game.createBall(frequency);
        isFrequency = true;
      }
    }
  }
}
