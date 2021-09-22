document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('file');
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault()
    modal.style.display = "none";
    if (input.files && input.files[0]) {
      toBase64(input.files[0]);
    }
  })

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
    let sketch = new SketchClass()
    setTimeout(() => {
      cloneAudio()
    }, 1500) // Interval entre les deux lancements
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
};

const cloneAudio = () => {
  const audioClone = audio.cloneNode(true);
  audioClone.muted = false;
  audioClone.volume = 1;
  audioClone.play();
  audioClone.addEventListener('ended', () => {
    setTimeout(() => {
      const score = getScore()
      document.getElementById('notes-succeed').innerHTML = score.succeed;
      document.getElementById('notes-failed').innerHTML = score.failed;
      document.getElementById('notes-total').innerHTML = score.total;
      document.getElementById('percent').innerHTML = score.percent + '%';
      document.getElementById('score-container').style.display = 'block';
      document.getElementById("myModal").style.display = 'block';
      audioClone.remove()
    }, 1500)
    
  })
}
