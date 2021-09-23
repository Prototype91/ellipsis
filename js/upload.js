const rythm = new Rythm();

let pulseRatio = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.chrome) {
    document.querySelector('#no-chrome').style.display = 'block';
  } else {
    document.querySelector('#form').style.display = 'block';
  }

  let intro = document.getElementById('intro')
  let game = document.getElementById('game')
  intro.addEventListener('click', () => {
    intro.style.display = "none";
    game.style.display = "block";
  })

  let zoom = 1;
  let circleWidth = 150;
  intervall = setInterval(function() {
    zoom += 0.01;
    let dot = document.querySelector(".dot")
    dot.style.transform = "scale(" + zoom + ")";

    if (circleWidth * zoom >= 500) {
      let title = document.getElementById('title');
      title.style.display = "block";
      clearInterval(intervall);
      setTimeout(() => {
        if (intro.style.display != 'none') {
          intro.click();
        }
      }, 5000)
      
    }
  }, 10);


  const input = document.getElementById('file');
  const select = document.getElementById('musics');

  let form = document.getElementById('form');
  let error = document.getElementById('error');
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.files && input.files[0]) {
      toBase64(input.files[0]);
      modal.style.display = "none";
      error.innerHTML = '';
    } else if (select.value) {
      fetch(select.value)
      .then(response => {
        return response.blob();
      })
      .then(blob => {
        toBase64(blob);        
        modal.style.display = "none";
        error.innerHTML = '';
      })
      .catch(err => console.log(err))
    } else {
      error.innerHTML = 'Veuillez saisir un fichier audio ...';
    }
  });

  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // }
})

const toBase64 = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    let sketch = new SketchClass(reader.result);
    rythm.setMusic(reader.result);
    rythm.start();
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
};
