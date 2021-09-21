const CIRCLE_SIZE = 250;
const WIDTH_CENTER = window.innerWidth / 2;
const HEIGHT_CENTER = window.innerWidth / 2;

const arc = new PIXI.Graphics();
let arcWrapper = new PIXI.Container();;

function main() {
  let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
  document.body.appendChild(app.view);
  const graphics = new PIXI.Graphics();

  let elapsed = 0.0;
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

   app.ticker.add((delta) => {
    arcWrapper.rotation -= 0.01 * delta;
  });
}

document.addEventListener('mousemove', (e) => {
  console.log(event.clientX, event.clientY);
});
window.onload = main();
