const CIRCLE_SIZE = 250;
const WIDTH_CENTER = window.innerWidth / 2;
const HEIGHT_CENTER = window.innerHeight / 2;
const NOTE_SIZE = 10;
const PRECISION = 6.25;

let score = 0;
let maxScore = 0;
let failNotes = 0;

let arcWrapper = new PIXI.Container();
let triangleWidth = 50;

let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, resizeTo: window, antialias: true, backgroundAlpha: 0 });
document.getElementById('game').appendChild(app.view);

function createCircle(circleSize, color, border) {
  const circle = new PIXI.Graphics();

  let circleWrapper = new PIXI.Container();
  
  circle.lineStyle(8, border, 1);
  circle.beginFill(color, 1);
  circle.drawEllipse(WIDTH_CENTER, HEIGHT_CENTER, circleSize, circleSize);
  circle.endFill();

  circleWrapper.addChild(circle);

  app.stage.addChild(circleWrapper);

  return {
    parent: circleWrapper,
    child: circle
  };
}

function createArc() {
  const arc = new PIXI.Graphics();

  arc.lineStyle(15, 0xb042ff, 1);
  arc.arc(0, 0, CIRCLE_SIZE, -1/4, 1/4);

  arcWrapper.addChild(arc);

  arcWrapper.position.set(WIDTH_CENTER, HEIGHT_CENTER);

  app.stage.addChild(arcWrapper);
}

function main() {
  const gameCircle = createCircle(CIRCLE_SIZE, 0x00000, 0xffffff );
  createArc(); 

  const rhythmWrapper = document.querySelector('.rythm-bass');
  
  app.ticker.add(() => {
    if (rhythmWrapper.style.transform) {
      const pulse = rhythmWrapper.style.transform.split('(')[1].split(')')[0];
      gameCircle.child.clear();
      gameCircle.child.lineStyle((pulse * 10) - 3, 0xffffff, 1);
      gameCircle.child.beginFill(0x00000, 1);
      gameCircle.child.drawEllipse(WIDTH_CENTER, HEIGHT_CENTER, CIRCLE_SIZE, CIRCLE_SIZE);
      gameCircle.child.endFill();

      const neon = (elem, value, options = {}) => {
        elem.style.boxShadow = `#fff 0 0 100px ${((value + 1) * 10) - 5}px`;
      }

      const resetNeon = elem => {
        elem.style.boxShadow = '';
      }

      rythm.addRythm('neon-custom', { dance: neon, reset: resetNeon }, 0, 10)

    }
  });
}

function createBall (frequency) {
  let note = createCircle(NOTE_SIZE, 0xFFFFFF, 0xFFFFFF).parent;

  const rad = (360 * Math.PI * frequency) / (800 * 180);

  const maxX = Math.cos(rad) * (CIRCLE_SIZE - (NOTE_SIZE));
  const maxY = Math.sin(rad) * (CIRCLE_SIZE - (NOTE_SIZE));

  let i = 0;

  let travel =  setInterval(() => {
    if (i >= 100) {
      maxScore += 1;
      let rotationWrapper = arcWrapper.rotation
      if (rotationWrapper < 0) {
        rotationWrapper += PRECISION;
      }
      let min = rotationWrapper - ((1/10) * Math.PI);
      let max = rotationWrapper + ((1/10) * Math.PI);
      let specialVerif = max > PRECISION;

      if (specialVerif) {
        max -= PRECISION;
      }

      if ((rad >= min && rad <= max && !specialVerif) || ((rad >= min || rad <= max) && specialVerif)) {
        score += 1;
      } else {
        failNotes++;
      }
      const pourcentage = (score / maxScore) * 100;
      document.querySelector('#score').innerHTML = Math.ceil(pourcentage) + '%';
      console.log(pourcentage, maxScore);
      if (pourcentage < 50 && maxScore > 20) {
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

function getScore() {
  dataScore =  {
    succeed: score,
    failed: failNotes,
    total: maxScore,
    percent: Math.ceil((score / maxScore) * 100),
  };
  score = failNotes = maxScore = 0;
  document.querySelector('#score').innerHTML = '0%';

  return dataScore;
}

document.addEventListener('mousemove', (e) => {
  const dir = -(Math.atan2(e.clientX - WIDTH_CENTER, e.clientY - HEIGHT_CENTER));
  arcWrapper.rotation = dir + (Math.PI / 2);
});

window.onload = main;
