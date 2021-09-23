const rythm = new Rythm();

let pulseRatio = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.chrome) {
    document.querySelector('#no-chrome').style.display = 'block';
  } else {
    document.querySelector('#form').style.display = 'block';
  }

    let zoom = 1;
    let circleWidth = 50;
    intervall = setInterval(function() {
      zoom += 0.02;
      let dot = document.querySelector(".dot")
      dot.style.transform = "scale(" + zoom + ")";

      console.log(dot.clientWidth);
      if (circleWidth * zoom >= 500) {
        let title = document.getElementById('title');
        title.style.display = "block";
        clearInterval(intervall);
        
      }
    }, 10);


  const input = document.getElementById('file');

  let form = document.getElementById('form');
  let error = document.getElementById('error');
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if (input.files && input.files[0]) {
      toBase64(input.files[0]);
      modal.style.display = "none";
    } else {
      error.innerHTML = 'Veuillez saisir un fichier audio ...';
    }
  });

  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
})

const toBase64 = (file) => {
  const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
    document.getElementById('audio').src = reader.result;
    let sketch = new SketchClass();
    rythm.setMusic(reader.result);
    rythm.start();
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
};
