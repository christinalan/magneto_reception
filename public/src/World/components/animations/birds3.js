import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { scene } from "../../World.js";
import { camera } from "../../World.js";
import { PositionalAudioHelper } from "https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/helpers/PositionalAudioHelper.js";

let audio, audioV, analyser;
let starling;
let flock = [];
let position, velocity, acceleration;

function createFlock() {
  position = new THREE.Vector3(
    window.innerWidth / 20,
    window.innerHeight / 10,
    0
  );
  velocity = new THREE.Vector3().random(Math.sin());
  acceleration = new THREE.Vector3().random(Math.cos());

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("images/textures/russian.png");

  const birdGeo = new THREE.SphereGeometry(0.1, position.x, position.y);
  const birdMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffdf,
    map: texture,
  });

  const listener = new THREE.AudioListener();
  camera.add(listener);

  for (let i = 0; i < 200; i++) {
    const s = i / 3;
    starling = new THREE.Mesh(birdGeo, birdMaterial);
    starling.position.set(s - 10, 0, -100);

    const birdAudio = document.getElementById("track11");
    audio = new THREE.PositionalAudio(listener);
    audio.setMediaElementSource(birdAudio);
    audio.setDistanceModel("exponential");
    audio.setRefDistance(300);
    audio.setDirectionalCone(90, 180, 0);
    audio.hasPlaybackControl = true;
    audio.autoplay = true;

    const helper = new PositionalAudioHelper(audio, 1);
    audio.add(helper);

    analyser = new THREE.AudioAnalyser(audio, 256);

    birdAudio.play();

    starling.add(audio);
    flock.push(starling);
  }

  flock.tick = () => {
    const clock = new THREE.Clock();
    const time = clock.getElapsedTime();

    for (let bird of flock) {
      const d = velocity.distanceTo(bird.position);

      if (d >= 20 && d <= 80) {
        velocity.multiplyScalar(-1);
        acceleration.multiplyScalar(-1);
        // const audio1 = bird.children[0];
        // audio1.rotation.set(
        //   Math.random(Math.sin(time * audioV)),
        //   Math.sin(audioV),
        //   Math.sin(time) * 30
        // );
      } else {
        velocity.multiplyScalar(0.1);
        acceleration.multiplyScalar(0.1);
      }

      bird.rotation.y += 0.1;
      bird.rotation.z += Math.sin(time);
      bird.position.add(velocity);
      velocity.add(acceleration).random(Math.sin());
      audioV += 1;
    }
  };

  return flock;
}

export { createFlock };
