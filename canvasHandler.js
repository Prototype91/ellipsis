const CIRCLE_SIZE = 250;
const WIDTH_CENTER = window.innerWidth / 2;
const HEIGHT_CENTER = window.innerHeight / 2;

const arc = new PIXI.Graphics();
let arcWrapper = new PIXI.Container();;

function main() {
  let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
  document.body.appendChild(app.view);
  const graphics = new PIXI.Graphics();

  graphics.lineStyle(2, 0xFFFFFF, 1);
  graphics.beginFill(0xAA4F08, 1);
  graphics.drawEllipse(WIDTH_CENTER, HEIGHT_CENTER, CIRCLE_SIZE, CIRCLE_SIZE);
  graphics.endFill();
  
  arc.lineStyle(5, 0xAA00BB, 1);
  arc.arc(0, 0, CIRCLE_SIZE, Math.PI / 3 , Math.PI / 2);

  arcWrapper.addChild(arc);

  app.stage.addChild(graphics);

  app.stage.addChild(arcWrapper);

  arcWrapper.position.set(WIDTH_CENTER, HEIGHT_CENTER);
}

document.addEventListener('mousemove', (e) => {
  const dir = -(Math.atan2(event.clientX - WIDTH_CENTER, event.clientY - HEIGHT_CENTER));
  arcWrapper.rotation = dir + 0.25;
});
window.onload = main;
