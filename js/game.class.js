class GameClass {
  CIRCLE_SIZE = 250;
  WIDTH_CENTER = window.innerWidth / 2;
  HEIGHT_CENTER = window.innerHeight / 2;
  NOTE_SIZE = 10;
  PRECISION = 6.25;
  score = 0;
  maxScore = 0;
  failNotes = 0;

  constructor (player) {
    this.player = player;

    this.gameContainer = document.getElementById('game-container');
    this.gameContainer.innerHTML = '';
    this.arcWrapper = new PIXI.Container();
    this.triangleWidth = 50;

    this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, resizeTo: window, antialias: true, backgroundAlpha: 0 });
    this.gameContainer.appendChild(this.app.view);
  }

  createCircle () {
    let circleWrapper = new PIXI.Container();

    let circle = new PIXI.Graphics();
    circle.lineStyle(8, 0xffffff, 1);
    circle.beginFill(0x000000, 1);
    circle.drawEllipse(this.WIDTH_CENTER, this.HEIGHT_CENTER, this.CIRCLE_SIZE, this.CIRCLE_SIZE);
    circle.endFill();

    circleWrapper.addChild(circle);

    this.app.stage.addChild(circleWrapper);
  }

  createNote () {
    let circleWrapper = new PIXI.Container();

    let ball = new PIXI.Graphics();
    ball.lineStyle(8, 0xffffff, 1);
    ball.beginFill(0xffffff, 1);
    ball.drawEllipse(this.WIDTH_CENTER, this.HEIGHT_CENTER, this.NOTE_SIZE, this.NOTE_SIZE);
    ball.endFill();

    circleWrapper.addChild(ball);

    this.app.stage.addChild(circleWrapper);

    return {
      parent: circleWrapper,
      child: ball
    };
  }

  createArc() {
    const arc = new PIXI.Graphics();
  
    arc.lineStyle(15, 0x9b4dca, 1);
    arc.arc(0, 0, this.CIRCLE_SIZE, -1/4, 1/4);
  
    this.arcWrapper.addChild(arc);
  
    this.arcWrapper.position.set(this.WIDTH_CENTER, this.HEIGHT_CENTER);
  
    this.app.stage.addChild(this.arcWrapper);
  }

  start () {
    const gameCircle = this.createCircle(this.CIRCLE_SIZE, 0x00000, 0xffffff);
    this.createArc();

    // const rhythmWrapper = document.querySelector('.rythm-bass');
    // const neon = document.querySelector('.neon-custom');

    // app.ticker.add(() => {
    //   if (rhythmWrapper.style.transform) {
    //     let pulse = rhythmWrapper.style.transform.split('(')[1].split(')')[0];
    //     pulse = (pulse * 10) - 3;

    //     gameCircle.child.clear();
    //     gameCircle.child.lineStyle(pulse, 0xffffff, 1);
    //     gameCircle.child.beginFill(0x00000, 1);
    //     gameCircle.child.drawEllipse(WIDTH_CENTER, HEIGHT_CENTER, CIRCLE_SIZE, CIRCLE_SIZE);
    //     gameCircle.child.endFill();

    //     neon.style.boxShadow = `#fff 0 0 100px ${pulse * 3}px`;
    //   }
    // });
  }

  createBall(frequency) {
    let note = this.createNote(this.NOTE_SIZE, 0xFFFFFF, 0xFFFFFF).parent;

    const rad = (360 * Math.PI * frequency) / (800 * 180);
  
    const maxX = Math.cos(rad) * (this.CIRCLE_SIZE - (this.NOTE_SIZE));
    const maxY = Math.sin(rad) * (this.CIRCLE_SIZE - (this.NOTE_SIZE));
  
    let i = 0;
  
    let travel = setInterval(() => {
      if (i >= 100) {
        this.maxScore += 1;
        let rotationWrapper = this.arcWrapper.rotation
        if (rotationWrapper < 0) {
          rotationWrapper += this.PRECISION;
        }
        let min = rotationWrapper - ((1 / 10) * Math.PI);
        let max = rotationWrapper + ((1 / 10) * Math.PI);
        let specialVerif = max > this.PRECISION;
  
        if (specialVerif) {
          max -= this.PRECISION;
        }
        console.log(min, rad, max);
        if ((rad >= min && rad <= max && !specialVerif) || ((rad >= min || rad <= max) && specialVerif)) {
          this.score += 1;
        } else {
          this.failNotes++;
        }
        const pourcentage = (this.score / this.maxScore) * 100;
        document.querySelector('#score').innerHTML = Math.ceil(pourcentage) + '%';
        if (pourcentage < 50 && this.maxScore > 30) {
          document.querySelector('#myModal').style.display = 'block';
          document.querySelector('#game-over').style.display = 'block';
        }
        note.destroy();
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

  setRotationArcWrapper (x, y) {
    const dir = -(Math.atan2(x - this.WIDTH_CENTER, y - this.HEIGHT_CENTER)) + (1/2) *Math.PI;
    this.arcWrapper.rotation = dir;
  }
}

// document.addEventListener('mousemove', (e) => {
//   const dir = -(Math.atan2(e.clientX - this.WIDTH_CENTER, e.clientY - this.HEIGHT_CENTER));
//   this.arcWrapper.rotation = dir + (Math.PI / 2);
// });

// window.onload = main;
