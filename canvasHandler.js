const CIRCLE_SIZE = 250;
const WIDTH_CENTER = window.innerWidth / 2;
const HEIGHT_CENTER = window.innerHeight / 2;
const NOTE_SIZE = 15;
let score = 0;
let maxScore = 0;

let arcWrapper = new PIXI.Container();

let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

let triangleWidth = 50;

function createCircle(circleSize, color, border) {
  const circle = new PIXI.Graphics();

  let circleWrapper = new PIXI.Container();
  
  circle.lineStyle(1, border, 1);
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

  arc.lineStyle(15, 0xFF0000, 1);
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
    }
  });
}

function createBall (frequency) {
  let note = createCircle(NOTE_SIZE, 0xFFFFFF, 0xFFFFFF).parent;

  const temp = 300;
  const rad = (360 * Math.PI * frequency) / (800 * 180);

  const maxX = Math.cos(rad) * (CIRCLE_SIZE - (NOTE_SIZE));
  const maxY = Math.sin(rad) * (CIRCLE_SIZE - (NOTE_SIZE));

  let i = 0;

    let travel =  setInterval(() => {
      if (i >= 100) {
        maxScore += 1;

        if (rad < arcWrapper.rotation + ((1/10) * Math.PI) && rad < arcWrapper.rotation - ((1/10) * Math.PI)) {
          //console.log(false);
        } else {
          //console.log(true);
          score += 1;
        }
        const pourcentage = (score / maxScore) * 100;
        document.querySelector('#score').innerHTML = Math.ceil(pourcentage) + '%';
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

document.addEventListener('mousemove', (e) => {
  const dir = -(Math.atan2(event.clientX - WIDTH_CENTER, event.clientY - HEIGHT_CENTER));
  arcWrapper.rotation = dir + (Math.PI / 2);
});

window.onload = main;
