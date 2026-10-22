import './style.css';
import { sceneConfig } from './scene/config';
import { createCubeScene, type CubeScene } from './scene/createCubeScene';

function element<T extends Element>(selector: string): T {
  const match = document.querySelector<T>(selector);
  if (!match) throw new Error(`Missing required page element: ${selector}`);
  return match;
}

const viewport = element<HTMLDivElement>('#scene-viewport');
const toggleButton = element<HTMLButtonElement>('#toggle-rotation');
const toggleLabel = element<HTMLSpanElement>('#toggle-label');
const resetButton = element<HTMLButtonElement>('#reset-rotation');
const speedInput = element<HTMLInputElement>('#rotation-speed');
const speedValue = element<HTMLOutputElement>('#speed-value');
const motionStatus = element<HTMLDivElement>('#motion-status');
const statusLabel = element<HTMLSpanElement>('#motion-status-label');
const sceneMessage = element<HTMLDivElement>('#scene-message');
const motionNote = element<HTMLParagraphElement>('#motion-note');
const pauseIcon = element<SVGElement>('.pause-icon');
const playIcon = element<SVGElement>('.play-icon');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const canvas = document.createElement('canvas');
canvas.className = 'scene-canvas';
canvas.setAttribute('role', 'img');
canvas.setAttribute(
  'aria-label',
  'A softly lit, colour-changing 3D cube that smoothly transforms into a sphere and back. Use the controls below to pause, resume, reset, or change the animation speed.',
);
viewport.append(canvas);

let scene: CubeScene | undefined;
let playing = !motionPreference.matches;
let contextLost = false;
let initializationFailed = false;

speedInput.min = String(sceneConfig.rotation.minSpeed);
speedInput.max = String(sceneConfig.rotation.maxSpeed);
speedInput.step = String(sceneConfig.rotation.speedStep);
speedInput.value = String(sceneConfig.rotation.defaultSpeed);

function updatePlayback(): void {
  const label = playing ? 'Pause' : 'Resume';
  toggleLabel.textContent = label;
  toggleButton.setAttribute('aria-label', `${label} animation`);
  pauseIcon.toggleAttribute('hidden', !playing);
  playIcon.toggleAttribute('hidden', playing);
  motionStatus.dataset.state =
    initializationFailed || contextLost ? 'unavailable' : playing ? 'running' : 'paused';
  statusLabel.textContent = initializationFailed
    ? 'Graphics unavailable'
    : contextLost
      ? 'Graphics interrupted'
      : playing
        ? 'In motion'
        : 'Paused';
  scene?.setPlaying(playing);
}

function updateSpeed(): void {
  const speed = Number(speedInput.value);
  speedValue.value = `${speed.toFixed(2)}×`;
  speedInput.setAttribute('aria-valuetext', `${speed.toFixed(2)} times normal speed`);
  scene?.setSpeed(speed);
}

function handleToggle(): void {
  playing = !playing;
  motionNote.hidden = true;
  updatePlayback();
}

function handleReset(): void {
  scene?.reset();
  speedInput.value = String(sceneConfig.rotation.defaultSpeed);
  updateSpeed();
}

function handleMotionPreference(event: MediaQueryListEvent): void {
  // If the OS switches to reduced motion, stop immediately. Leaving that mode
  // does not override a pause the user deliberately chose.
  if (event.matches) {
    playing = false;
    motionNote.hidden = false;
    updatePlayback();
  } else {
    motionNote.hidden = true;
  }
}

function setControlsDisabled(disabled: boolean): void {
  toggleButton.disabled = disabled;
  resetButton.disabled = disabled;
  speedInput.disabled = disabled;
}

function showSceneMessage(message: string): void {
  sceneMessage.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  sceneMessage.append(paragraph);
  sceneMessage.hidden = false;
}

try {
  scene = createCubeScene(canvas, viewport, {
    playing,
    onContextLost() {
      contextLost = true;
      setControlsDisabled(true);
      showSceneMessage(
        'The graphics connection was interrupted. Waiting for the browser to restore it…',
      );
      updatePlayback();
    },
    onContextRestored() {
      contextLost = false;
      setControlsDisabled(false);
      sceneMessage.hidden = true;
      updatePlayback();
    },
  });
  sceneMessage.hidden = true;
  setControlsDisabled(false);
  motionNote.hidden = !motionPreference.matches;
  updatePlayback();
  updateSpeed();
} catch (error) {
  initializationFailed = true;
  setControlsDisabled(true);
  console.error('Unable to initialise the cube scene:', error);
  canvas.remove();
  motionStatus.dataset.state = 'unavailable';
  statusLabel.textContent = 'Graphics unavailable';
  showSceneMessage(
    'This scene needs WebGL 2. Enable graphics acceleration in your browser settings, or try another supported browser.',
  );
}

toggleButton.addEventListener('click', handleToggle);
resetButton.addEventListener('click', handleReset);
speedInput.addEventListener('input', updateSpeed);
motionPreference.addEventListener('change', handleMotionPreference);

// A fresh canvas and explicit teardown prevent duplicate animation loops and
// retained GPU resources when Vite replaces this module during development.
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    toggleButton.removeEventListener('click', handleToggle);
    resetButton.removeEventListener('click', handleReset);
    speedInput.removeEventListener('input', updateSpeed);
    motionPreference.removeEventListener('change', handleMotionPreference);
    scene?.dispose();
    canvas.remove();
  });
}
