class GameClass {
  circleSize = 250;
  widthCenter = window.innerWidth / 2;
  heightCenter = window.innerHeight / 2;
  noteSize = 10;
  precision = 6.25;
  score = 0;
  maxScore = 0;
  failNotes = 0;
  gameOver = false;

  constructor(player) {
    this.player = player;

    this.gameContainer = document.getElementById('game-container');
    this.gameContainer.innerHTML = '';
    this.arcWrapper = new PIXI.Graphics();
    this.triangleWidth = 50;

    this.app = null;
    this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, resizeTo: window, antialias: true, transparent: true });
    this.gameContainer.appendChild(this.app.view);

    this.colors = [0xFF1493, 0x00FFFF, 0xFFFF00];

    this.burst = new mojs.Burst({
      radius: { 0: 50 },
      count: 5,
      children: {
        shape: 'circle',
        radius: 15,
        fill: ['deeppink', 'cyan', 'yellow'],
        strokeWidth: 5,
        duration: 2000
      }
    });
  }

  generateColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  createNote() {

    let ball = new PIXI.Graphics();
    const color = this.generateColor();
    ball.lineStyle(8, color, 1);
    ball.beginFill(color, 1);
    ball.drawEllipse(this.widthCenter, this.heightCenter, this.noteSize, this.noteSize);
    ball.endFill();
    this.app.stage.addChild(ball);

    return ball;
  }

  createArc() {
    this.arcWrapper.lineStyle(15, 0xFF1493, 1);
    this.arcWrapper.arc(0, 0, this.circleSize, -1 / 4, 1 / 4);

    this.arcWrapper.position.set(this.widthCenter, this.heightCenter);

    this.app.stage.addChild(this.arcWrapper);
  }

  start () {
    this.gameOver = false;
    this.createArc();

    const ticker = PIXI.Ticker.shared;
    ticker.autoStart = false;
    ticker.stop();
  }

  createBall(frequency) {
    let note = this.createNote(this.noteSize, 0xFFFFFF, 0xFFFFFF);

    const rad = (360 * Math.PI * frequency) / (800 * 180);

    const maxX = Math.cos(rad) * (this.circleSize - (this.noteSize));
    const maxY = Math.sin(rad) * (this.circleSize - (this.noteSize));

    let i = 0;

    let travel = setInterval(() => {
      if (i >= 100) {
        this.maxScore += 1;
        let rotationWrapper = this.arcWrapper.rotation
        if (rotationWrapper < 0) {
          rotationWrapper += this.precision;
        }
        let min = rotationWrapper - ((1 / 10) * Math.PI);
        let max = rotationWrapper + ((1 / 10) * Math.PI);
        let specialVerif = max > this.precision;

        if (specialVerif) {
          max -= this.precision;
        }

        if ((rad >= min && rad <= max && !specialVerif) || ((rad >= min || rad <= max) && specialVerif)) {
          this.score += 1;
          this.burst
            .tune({ x: (maxX / 100) * i, y: (maxY / 100) * i })
            .setSpeed(3)
            .replay();
        } else {
          this.failNotes++;
        }
        const pourcentage = (this.score / this.maxScore) * 100;
        document.querySelector('#score').innerHTML = Math.ceil(pourcentage) + '%';

        if (pourcentage < 50 && this.maxScore > 30 && !this.gameOver) {
          this.gameOver = true;
          this.player.reset();
          document.querySelector('#myModal').style.display = 'block';
          document.querySelector('#game-over').style.display = 'block';
          document.getElementById("form").style.display = 'none';
          document.getElementById("replay").style.display = 'block';

          let voice = new Audio('./sounds/bad.mp3');
          voice.volume = 1;
          voice.play();
        }

        note.destroy({ children: true, texture: true, baseTexture: true });
        note = undefined;
        clearInterval(travel);
      } else {
        const x = (maxX / 100) * i;
        const y = (maxY / 100) * i;
        note.position.set(x, y);
        i++;
      }
    }, 15);
  }

  getScore() {
    let dataScore = {
      succeed: this.score,
      failed: this.failNotes,
      total: this.maxScore,
      percent: Math.ceil((this.score / this.maxScore) * 100),
    };

    this.score = this.failNotes = this.maxScore = 0;
    document.querySelector('#score').innerHTML = '0%';

    return dataScore;
  }

  destroyApp() {
    this.app.stop();
    this.app.destroy();
  }

  setRotationArcWrapper(x, y) {
    this.arcWrapper.rotation = -(Math.atan2(x - this.widthCenter, y - this.heightCenter)) + (1 / 2) * Math.PI;
  }
}
