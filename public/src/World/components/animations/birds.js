import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { createRenderer } from "../../systems/renderer.js";
import { scene } from "../../World.js";
import { camera } from "../../World.js";
import { PositionalAudioHelper } from "https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/helpers/PositionalAudioHelper.js";

let last = performance.now();
let birds;
let audio, analyser;
let position, velocity, acceleration;

function mapRange(value, minf, maxf, mins, maxs) {
  value = (value - minf) / (maxf - minf);
  return mins + value * (maxs - mins);
}

function createLineBird() {
  const vector = new THREE.Vector4();
  const vertexCount = 150 * 3;
  const geometry = new THREE.BufferGeometry();

  const positions = [];
  const colors = [];
  const offsets = [];
  const orientationsStart = [];
  const orientationsEnd = [];

  for (let i = 0; i < vertexCount; i++) {
    offsets.push(Math.random() - 1, Math.random() - 1, Math.random() - 1);

    // adding x,y,z
    positions.push(-50 + (Math.random() * i) / 4);
    positions.push(-20 + Math.random() - 0.5);

    // positions.push(Math.random() - 0.5);
    // positions.push(Math.random() - 0.5);
    positions.push(-20 + Math.random() - 0.5);

    // adding r,g,b,a
    colors.push(Math.random() * 100);
    colors.push(Math.random() * 100);
    colors.push(Math.random() * 255);
    colors.push(Math.random() * 150);
    // orientation start

    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    vector.normalize();

    orientationsStart.push(vector.x, vector.y, vector.z, vector.w);

    // orientation end

    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    vector.normalize();

    orientationsEnd.push(vector.x, vector.y, vector.z, vector.w);
  }

  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  const colorAttribute = new THREE.Uint8BufferAttribute(colors, 4);
  colorAttribute.normalized = true;

  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("color", colorAttribute);

  geometry.setAttribute(
    "offset",
    new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
  );
  geometry.setAttribute(
    "orientationStart",
    new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
  );
  geometry.setAttribute(
    "orientationEnd",
    new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
  );

  // const birdUniforms = {
  //   texturePosition: { value: null },
  //   textureVelocity: { value: null },
  //   time: { value: 0.0 },
  //   delta: { value: 0.0 },
  //   sineTime: { value: 1.0 },
  // };

  const material = new THREE.RawShaderMaterial({
    uniforms: {
      texturePosition: { value: 0.0 },
      textureVelocity: { value: 0.0 },
      time: { value: 0.0 },
      delta: { value: 0.0 },
      sineTime: { value: 1.0 },
    },
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    side: THREE.DoubleSide,
    transparent: true,
  });

  birds = new THREE.Mesh(geometry, material);

  birds.rotation.x = Math.PI / 2;
  birds.matrixAutoUpdate = false;
  birds.updateMatrix();

  // const positionUniforms = birds.material.uniforms;
  // positionUniforms["time"] = { value: 0.0 };
  // positionUniforms["delta"] = { value: 0.0 };

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const birdAudio = document.getElementById("track10");
  audio = new THREE.PositionalAudio(listener);
  audio.setMediaElementSource(birdAudio);
  audio.setDistanceModel("exponential");
  audio.setRefDistance(300);
  audio.setDirectionalCone(90, 190, 0);
  audio.hasPlaybackControl = true;
  audio.autoplay = true;
  audio.rotation.set(0, 0, 0);
  audio.position.set(0, -30, 0);

  const helper = new PositionalAudioHelper(audio, 3);
  // audio.add(helper);

  birdAudio.play();

  birds.add(audio);
  analyser = new THREE.AudioAnalyser(audio, 256);

  birds.tick = () => {
    const now = performance.now();
    let delta = (now - last) / 1000;

    const data = analyser.getFrequencyData();
    const dataAvg = analyser.getAverageFrequency();

    if (delta > 1) delta = 1; // safety cap on large deltas
    last = now;

    // positionUniforms["time"].value = now * 0.005;
    // positionUniforms["delta"].value = delta * 0.005;

    for (let i = 0; i < data.length; i++) {
      let value = 1;
      const v = data[i] / 512;
      const y = (v * 300) / 5000;

      var newMap = mapRange(value, 0, 255, 0, v);
      var otherMap = mapRange(
        value,
        0,
        1024,
        window.innerHeight / 5000,
        dataAvg
      );

      position = new THREE.Vector3(window.innerWidth / 100, 0, 0);

      velocity = new THREE.Vector3(otherMap, Math.sin(v), 0);
      acceleration = new THREE.Vector3(Math.sin(v), Math.sin(otherMap), v);

      const object = scene.children[3];
      object.rotation.z += Math.sin(v);

      const d = velocity.distanceTo(audio.position);

      if (d > 10 && d < 50) {
        velocity.multiplyScalar(-1);
        acceleration.multiplyScalar(-1);
      }

      object.children[0].rotation.z += Math.sin(y) * 0.1;
      object.children[0].rotation.y += Math.sin(v) * 0.02;
      object.position.set(Math.sin(now), Math.sin(v), 0);

      object.material.uniforms["time"].value = 0.05 * now;
      object.material.uniforms["sineTime"].value = Math.tan(
        object.material.uniforms["time"].value * 0.005
      );
    }
  };

  return birds;
}

export { createLineBird };
