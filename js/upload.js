document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('file');
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.files && input.files[0]) {
      toBase64(input.files[0]);
    }
  })
})

const toBase64 = (file) => {
  const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
    document.getElementById('audio').src = reader.result;
    let sketch = new SketchClass()
    setTimeout(() => {
      cloneAudio()
    }, 1000) // Interval entre les deux lancements
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
};

const cloneAudio = () => {
  const audioClone = audio.cloneNode(true);
  audioClone.muted = false;
  audioClone.volume = 1;
  // audioClone.play();
}