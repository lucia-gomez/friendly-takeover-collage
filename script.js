const startUi = document.getElementById("start");
const container = document.getElementById("container");
const video = document.getElementsByTagName("video")[0];
const allAudio = document.getElementsByTagName("audio");
const bgAudio = document.getElementById("bgAudio");
const lionAudio = document.getElementById('lionAudio');
const toggleAudioIcon = document.getElementById("toggleAudio");
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

function hide(obj) {
  obj.classList.replace('shown', 'hidden');
}

function show(obj) {
  obj.classList.replace('hidden', 'shown');
}

function start() {
  hide(startUi);
  show(container);
  if (isMobile)
    container.style.overflowX = 'scroll';
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
  const collagePieces = document.getElementsByClassName("collage-piece");
  for (let piece of collagePieces) {
    show(piece)
  }
  setTimeout(() => {video.className = 'hidden';}, 2000);
}

function lion() {
  if (animationTimers['lion'] != null) {
    clearTimeout(animationTimers['lion']);
  }
  const img = document.getElementById('lionCub');
  show(img);
  if (isAudioEnabled()) {
    lionAudio.currentTime = 0;
    lionAudio.play();
  }

  img.classList.remove('lion-animation');
  void img.offsetWidth;
  img.classList.add('lion-animation');

  const lionTimerId = setTimeout(() => {
    lionAudio.pause();
    hide(img);
    animationTimers['lion'] = null;
  }, 8000);
  animationTimers['lion'] = lionTimerId;
}

function toggleAudio() {
  if (isAudioEnabled()) {
    for(let audio of allAudio) {
      audio.pause();
    }
    toggleAudioIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    localStorage.setItem(VOLUME_STORAGE_KEY, 'false');
  } else {
    bgAudio.play();
    if (animationTimers['lion'] != null) {
      lionAudio.play();
    }
    toggleAudioIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    localStorage.setItem(VOLUME_STORAGE_KEY, 'true');
  }
}