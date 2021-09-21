const CIRCLE_SIZE = 250;
const WIDTH_CENTER = window.innerWidth / 2;
const HEIGHT_CENTER = window.innerHeight / 2;

let arcWrapper = new PIXI.Container();


let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

let triangleWidth = 50;

function createCircle(circleSize, color) {
  const circle = new PIXI.Graphics();

  let circleWrapper = new PIXI.Container();
  
  circle.lineStyle(2, 0xFFFFFF, 1);
  circle.beginFill(color, 1);
  circle.drawEllipse(WIDTH_CENTER, HEIGHT_CENTER, circleSize, circleSize);
  circle.endFill();

  circleWrapper.addChild(circle);
  
  app.stage.addChild(circleWrapper);

  return circleWrapper;
}

function createArc() {
  const arc = new PIXI.Graphics();

  arc.lineStyle(5, 0xAA00BB, 1);
  arc.arc(0, 0, CIRCLE_SIZE, Math.PI / 3, Math.PI / 2);

  arcWrapper.addChild(arc);

  arcWrapper.position.set(WIDTH_CENTER, HEIGHT_CENTER);

  app.stage.addChild(arcWrapper);
}

function main() {
  createCircle(CIRCLE_SIZE, 0x76AB59);
  createArc();

  let note = createCircle(25, 0xFFFFFF);
  console.log('NOTE', note)

  let i = 0;
  let travel = setInterval(() => {
    i += 10;
    note.position.set(i, 0);

    if (i > CIRCLE_SIZE - 12.5) {
      clearInterval(travel);
    }

  }, 100);
}

document.addEventListener('mousemove', (e) => {
  const dir = -(Math.atan2(event.clientX - WIDTH_CENTER, event.clientY - HEIGHT_CENTER));
  arcWrapper.rotation = dir + 0.25;
});

window.onload = main;
