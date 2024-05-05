document.addEventListener('DOMContentLoaded', function() {
  // Check for browser support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('getUserMedia is not supported in this browser');
    return;
  }

  // Request microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      // Create an AudioContext
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      // Connect the microphone stream to the analyser
      var microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      // Analyser setup
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      // Function to detect blowing
      function detectBlow() {
        analyser.getByteFrequencyData(dataArray);

        // Analyze dataArray to detect blowing
        if (isBlowDetected(dataArray)) {
          // Hide the flame element
          var flame = document.querySelector('.flame');
          if (flame) {
            flame.style.display = 'none';
          }

          // Play the "hbd.mp3" sound file
          playBirthdayMusic();

          // Activate confetti
          confettiCelebration();
        }

        // Repeat the detection
        requestAnimationFrame(detectBlow);
      }

      // Start blow detection
      detectBlow();
    })
    .catch(function(err) {
      console.error('Error accessing microphone:', err);
    });
});

// Function to detect blowing
function isBlowDetected(audioData) {
  // Calculate the average amplitude of the frequency data
  var sum = audioData.reduce((acc, val) => acc + val, 0);
  var averageAmplitude = sum / audioData.length;

  // Define a threshold amplitude level (adjust as needed)
  var threshold = 100;

  // Check if the average amplitude exceeds the threshold
  return averageAmplitude > threshold;
}

// Function to play birthday music
function playBirthdayMusic() {
  // Create an audio element
  var audio = new Audio('hbd.mp3');
  audio.play(); // Play the audio immediately
}

// Function to activate confetti
function confettiCelebration() {
  confetti.start();
}
