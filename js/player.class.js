const neonCustom = (elem, value, options = {}) => {
  elem.style.boxShadow = `0 0 100px ${value * 12}px #fff`;

  const max = options.max;
  const min = options.min;
  const borderWidth = (max - min) * value + min
  elem.style.borderWidth = borderWidth + 'px'; 
  elem.style.outline = borderWidth + 'px solid #fff, 0 0 0 3px #fff';
}

const resetNeonCustom = elem => {
  elem.style.boxShadow = '';
  elem.style.outline = '';
  elem.style.borderWidth = '';
}


class PlayerClass {
  pitch = null;
  rythm = new Rythm();
  game = null;
  interval = null;

  constructor(url) {
    this.audioContext = new AudioContext();
    this.audio = new Audio(url);
    this.rythm.setMusic(url);
    this.rythm.addRythm('game-circle', { dance: neonCustom, reset: resetNeonCustom }, 0, 10, {
      min: 3,
      max: 8,
    });
  }

  reset() {
    clearInterval(this.interval);
    let self = this;
    setTimeout(() => {
      self.audio.pause();
      self.rythm.stop();
      self.pitch = null;
      self.game = null;
      self.interval = null;
    }, 300)
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
    this.audio.volume = 0.5;
    this.audio.play();
    this.rythm.start();

    this.audio.addEventListener('ended', () => {
      setTimeout(() => {
        const score = game.getScore();
        this.reset();
        let voice = new Audio('./sounds/nul.mp3');;
        let rank = 'F';

        if (score.percent >= 95) {
          rank = 'S';
          voice = new Audio('./sounds/presque.mp3');
        } else if (score.percent >= 90) {
          rank = 'A';
          voice = new Audio('./sounds/presque2.mp3');
        } else if (score.percent >= 80) {
          rank = 'B';
          voice = new Audio('./sounds/presque2.mp3');
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
        document.getElementById("form").style.display = 'none';
        document.getElementById("replay").style.display = 'block';
        voice.volume = 1;
        voice.play();
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
    this.interval = setInterval(() => {
      this.getPitch()
    }, 300)
  }

  stopMusic() {
    this.audio.pause();
  }

  async getPitch() {
    let isFrequency = false;
    while (!isFrequency) {
      const frequency = await this.pitch.getPitch();
      if (frequency) {
        this.game.createBall(frequency);
        isFrequency = true;
      }
    }
  }
}
