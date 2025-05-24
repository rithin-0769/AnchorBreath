// DOM Elements
const circle = document.querySelector('.breath-circle');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const soundBtn = document.getElementById('sound-btn');
const instruction = document.querySelector('.instruction');
const waveAudio = document.getElementById('wave-audio');
const depthFill = document.querySelector('.depth-fill');
const depthLabel = document.querySelector('.depth-label');

let breathInterval;
let isSoundOn = true;
let breathPhase = 0; // 0=inhale, 1=hold, 2=exhale

// Toggle wave sound
soundBtn.addEventListener('click', () => {
  isSoundOn = !isSoundOn;
  soundBtn.innerHTML = `<i class="fas fa-wave-square"></i> Sound: ${isSoundOn ? 'On' : 'Off'}`;
  if (isSoundOn) waveAudio.play();
  else waveAudio.pause();
});

// Animate depth meter
function animateDepth(targetPercent, duration) {
  const startPercent = parseFloat(depthFill.style.width) || 0;
  const increment = (targetPercent - startPercent) / (duration / 10);
  let current = startPercent;

  const timer = setInterval(() => {
    current += increment;
    depthFill.style.width = `${current}%`;
    depthLabel.textContent = `Depth: ${Math.round(current)}%`;
    if (Math.abs(current - targetPercent) < 0.1) clearInterval(timer);
  }, 10);
}

// Breathing logic
function startBreathing() {
  circle.classList.remove('breath-paused');
  breathPhase = (breathPhase + 1) % 3;

  switch (breathPhase) {
    case 0: // Inhale (4s)
      instruction.textContent = "Breathe in... (Depth increasing)";
      circle.style.transform = "scale(1.5)";
      animateDepth(100, 4000);
      break;
    case 1: // Hold (4s)
      instruction.textContent = "Hold... (Steady)";
      break;
    case 2: // Exhale (6s)
      instruction.textContent = "Breathe out... (Rising)";
      circle.style.transform = "scale(1)";
      animateDepth(0, 6000);
      break;
  }
}

// Start/pause controls
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  if (isSoundOn) waveAudio.play();
  breathInterval = setInterval(startBreathing, 14000); // Full cycle: 14s
  startBreathing();
});

stopBtn.addEventListener('click', () => {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  clearInterval(breathInterval);
  waveAudio.pause();
  circle.classList.add('breath-paused');
  instruction.textContent = "Anchored. Ready to continue.";
  circle.style.transform = "scale(1)";
});