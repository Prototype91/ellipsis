const CIRCLE_SIZE = 250;
const WIDTH_CENTER = window.innerWidth / 2;
const HEIGHT_CENTER = window.innerHeight / 2;
const NOTE_SIZE = 15;

let score = 0;
let maxScore = 0;
let failNotes = 0;

let arcWrapper = new PIXI.Container();
let triangleWidth = 50;


let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, resizeTo: window });
document.body.appendChild(app.view);

function createCircle(circleSize, color, border) {
  const circle = new PIXI.Graphics();

  let circleWrapper = new PIXI.Container();

  circle.lineStyle(2, color, 1);
  circle.beginFill(border, 1);
  circle.drawEllipse(WIDTH_CENTER, HEIGHT_CENTER, circleSize, circleSize);
  circle.endFill();

  circleWrapper.addChild(circle);

  app.stage.addChild(circleWrapper);

  return circleWrapper;
}

function createArc() {
  const arc = new PIXI.Graphics();

  arc.lineStyle(10, 0xFF0000, 1);
  arc.arc(0, 0, CIRCLE_SIZE, -1 / 4, 1 / 4);

  arcWrapper.addChild(arc);

  arcWrapper.position.set(WIDTH_CENTER, HEIGHT_CENTER);

  app.stage.addChild(arcWrapper);
}

function main() {
  createCircle(CIRCLE_SIZE, 0xffffff, 0x00000 );
  createArc();
  createBall(600);
}

function createBall(frequency) {
  let note = createCircle(NOTE_SIZE, 0xFFFFFF, 0xFFFFFF);

  const rad = (360 * Math.PI * frequency) / (800 * 180);

  const maxX = Math.cos(rad) * (CIRCLE_SIZE - (NOTE_SIZE));
  const maxY = Math.sin(rad) * (CIRCLE_SIZE - (NOTE_SIZE));

  let i = 0;

  let travel =  setInterval(() => {
    if (i >= 100) {
      maxScore += 1;
      console.log(rad, arcWrapper.rotation)
      if (rad < arcWrapper.rotation + ((1/10) * Math.PI) && rad < arcWrapper.rotation - ((1/10) * Math.PI)) {
        console.log(false);
        failNotes++;
      } else {
        console.log(true);
        score += 1;
      }
      const pourcentage = (score / maxScore) * 100;
      document.querySelector('#score').innerHTML = Math.ceil(pourcentage) + '%';
      note.parent.removeChild(note);
      clearInterval(travel);
    }
    const x = (maxX / 100) * i;
    const y = (maxY / 100) * i;
    note.position.set(x, y);
    i++;
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
  // console.log(dir)
  arcWrapper.rotation = dir + (Math.PI / 2);
  // console.log(arcWrapper.rotation - ((1/10) * Math.PI), arcWrapper.rotation, arcWrapper.rotation + ((1/10) * Math.PI))
});

window.onload = main;
