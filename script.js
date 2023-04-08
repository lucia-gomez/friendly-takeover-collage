const startUi = document.getElementById("start");
const container = document.getElementById("container");
const video = document.getElementsByTagName("video")[0];
const allAudio = document.getElementsByTagName("audio");
const bgAudio = document.getElementById("bgAudio");
const birdsAudio = document.getElementById('birdsAudio');
const carAudio = document.getElementById('carAudio');
const lionAudio = document.getElementById('lionAudio');
const toggleAudioIcon = document.getElementById("toggleAudio");
const collagePieces = document.getElementsByClassName("collage-piece");

const animationTimers = {};

const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
const isMobile = width <= 768;

const VOLUME_STORAGE_KEY = 'friendly_takeover_volume_enabled';
if (localStorage.getItem(VOLUME_STORAGE_KEY) === 'false') {
  toggleAudio();
}

function isAudioEnabled() {
  return toggleAudioIcon.classList.contains('fa-volume-up');
}

function resumeAudio() {
  if (!isAudioEnabled()) return;
  bgAudio.play()
  if (animationTimers['lion'] != null) {
    lionAudio.play();
  }
  if (animationTimers['car'] != null) {
    carAudio.play();
  }
  if (animationTimers['birds'] != null) {
    birdsAudio.play();
  }
}

window.addEventListener('blur', () => {
  for(let audio of allAudio) {
    audio.pause();
  }
});
window.addEventListener('focus', () => {
  resumeAudio();
});

function hide(obj) {
  obj.classList.replace('shown', 'hidden');
}

function show(obj) {
  obj.classList.replace('hidden', 'shown');
}

function start() {
  if (isMobile) {
    video.width = collagePieces[0].width;
    container.style.overflowX = 'scroll';
    document.getElementById('animation-clip').style.width = collagePieces[0].width;
  }
  hide(startUi);
  show(container);
  show(video);
  if (isAudioEnabled()) {
    bgAudio.currentTime = 0;
    bgAudio.play();
  }
  video.currentTime = 0;
  video.play();
}

function restart() {
  const allAudio = document.getElementsByTagName("audio");
  for(let audioItem of allAudio) {
    audioItem.pause();
  }
  const hideOnRestart = document.getElementsByClassName("hide-on-restart");
  for(let item of hideOnRestart) {
    hide(item);
  }
  for(let key in animationTimers) {
    clearTimeout(animationTimers[key]);
    animationTimers[key] = null;
  }
  start();
}

function swap() {
  for (let piece of collagePieces) {
    show(piece)
  }
  setTimeout(() => {video.className = 'hidden';}, 2000);
}

function resetAnimation(obj, audio, key, duration) {
  // reset animation timer, if already running
  if (animationTimers[key] != null) {
    clearTimeout(animationTimers[key]);
  }

  // reset audio
  if (isAudioEnabled()) {
    audio.currentTime = 0;
    audio.play();
  }

  // restart animation
  obj.style.animationName = 'none';
  requestAnimationFrame(() => {
    setTimeout(() => {
      obj.style.animationName = '';
    }, 0);
  });
  show(obj);

  // start timer to clear animation
  const timerId = setTimeout(() => {
    audio.pause();
    hide(obj);
    animationTimers[key] = null;
  }, duration);
  obj.classList.add(key + '-animation');
  animationTimers[key] = timerId;
}

function lion() {
  const img = document.getElementById('lionCub');
  resetAnimation(img, lionAudio, 'lion', 8000);
}

function car() {
  const car = document.getElementById('car');
  resetAnimation(car, carAudio, 'car', 7000);
}

function birds() {
  const birds = document.getElementById('birds');
  resetAnimation(birds, birdsAudio, 'birds', 15000);
}

function toggleAudio() {
  if (isAudioEnabled()) {
    for(let audio of allAudio) {
      audio.pause();
    }
    toggleAudioIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    localStorage.setItem(VOLUME_STORAGE_KEY, 'false');
  } else {
    toggleAudioIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    resumeAudio();
    localStorage.setItem(VOLUME_STORAGE_KEY, 'true');
  }
}