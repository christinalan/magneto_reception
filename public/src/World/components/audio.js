import * as THREE from "https://unpkg.com/three@0.121.1/build/three.module.js";
import { createCamera } from "./camera.js";

let listenButton = document.getElementById("startButton");
let audioStream;
let analyser, dataFreq;

// listenButton.addEventListener("click", () => {
//   audio.addEventListener("loadeddata", setStream);
// });

function setStream() {
  console.log("audio passed through");
  const listener = new THREE.AudioListener();
  const camera = createCamera();

  camera.add(listener);

  audioStream = new THREE.PositionalAudio(listener);
  // audioStream.setMediaElementSource(audio);
  audioStream.setVolume(1);

  return audioStream;
}

export { setStream };
