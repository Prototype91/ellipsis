let sketch = null;
let game = null;
let init = false;

let pulseRatio = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.chrome) {
    document.querySelector('#no-chrome').style.display = 'block';
  } else {
    document.querySelector('#form').style.display = 'block';
  }

  let intro = document.getElementById('intro');
  let game = document.getElementById('game');


  intro.addEventListener('click', () => {
    intro.style.display = "none";
    game.style.display = "block";
  })

  let zoom = 1;
  let circleWidth = 150;

  interval = setInterval(function() {
    zoom += 0.01;
    let dot = document.querySelector(".dot")
    dot.style.transform = "scale(" + zoom + ")";

    if (circleWidth * zoom >= 500) {
      let title = document.getElementById('title');
      title.style.display = "block";
      clearInterval(interval);
      setTimeout(() => {
        if (intro.style.display != 'none') {
          intro.click();
        }
      }, 5000);      
    }
  }, 10);


  const input = document.getElementById('file');
  const select = document.getElementById('musics');

  let form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.files && input.files[0]) {
      toBase64(input.files[0]);
      modal.style.display = "none";
      setErrorText('');
    } else if (select.value) {
      fetch(select.value)
      .then(response => {
        return response.blob();
      })
      .then(blob => {
        toBase64(blob);        
        modal.style.display = "none";
        setErrorText('');
      })
      .catch(err => console.log(err))
    } else {
      setErrorText('Veuillez saisir un fichier audio ...');
    }
  });

  const modal = document.getElementById("myModal");
  modal.style.display = "block";
})

const toBase64 = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    startGame(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
};

const startGame = (url) => {
  player = null;
  game = null;
  console.log(player, game)
  player = new PlayerClass(url);
  game = new GameClass(player);  
  console.log(player, game)
  game.start();
  if(!init) {
    document.addEventListener('mousemove', (e) => {
      game.setRotationArcWrapper(e.clientX, e.clientY);
    });
    init = false;
  }
  
  player.start(game);
}

const setErrorText = (msg) => {
  document.getElementById('error').innerHTML = msg;
}