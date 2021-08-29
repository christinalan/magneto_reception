// import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import * as THREE from "https://unpkg.com/three@0.121.1/build/three.module.js";
import { PositionalAudioHelper } from "https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/helpers/PositionalAudioHelper.js";
import { camera } from "../../World.js";

let cylinders = [];
let audio, audio1, analyser;
let angle = 0;

let sig;
let sigs = [];

function wait() {
  setTimeout(sigplay, 10000);
}

function sigplay() {
  sig.play();
  sig.onended = (e) => {
    wait();
  };
}

function mapRange(value, minf, maxf, mins, maxs) {
  value = (value - minf) / (maxf - minf);
  return mins + value * (maxs - mins);
}

function createCylinder() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("images/textures/sdr_earth.jpeg");

  const geo = new THREE.CylinderGeometry(50, 50, 2000, 2000);
  const geo1 = new THREE.CylinderGeometry(8, 8, 500, 500);
  const mat = new THREE.MeshLambertMaterial({
    alphaTest: 0.6,
    opacity: 0.7,
    transparent: true,
    map: texture,
  });
  mat.side = THREE.DoubleSide;

  const cylinder1 = new THREE.Mesh(geo, mat);
  cylinder1.rotation.set(Math.PI / 2, 0, 0);
  cylinder1.position.set(0, 7, 50);
  cylinders.push(cylinder1);

  const listener = new THREE.AudioListener();
  camera.add(listener);

  sig = document.getElementById("track3");
  audio = new THREE.PositionalAudio(listener);
  audio.setMediaElementSource(sig);
  audio.setDistanceModel("exponential");
  audio.setRefDistance(100);
  audio.setDirectionalCone(45, 180, 0);
  audio.hasPlaybackControl = true;
  audio.autoplay = true;
  audio.rotation.set(Math.PI / 2, Math.PI / 5, 0);

  // sig.play();

  // sigplay(); don't use, wait function

  const helper = new PositionalAudioHelper(audio, 10);
  // audio.add(helper);

  cylinder1.add(audio);

  analyser = new THREE.AudioAnalyser(audio, 256);

  const sig1 = document.getElementById("track4");
  const sig2 = document.getElementById("track5");
  const sig3 = document.getElementById("track6");
  const sig4 = document.getElementById("track7");
  const sig5 = document.getElementById("track8");
  sigs.push(sig1, sig2, sig3, sig4, sig5);

  for (let i = 0; i < 5; i++) {
    const cylinder = new THREE.Mesh(geo1, mat);
    cylinder.rotation.set(
      Math.random(i) * Math.PI,
      0,
      Math.random(i * Math.PI)
    );
    cylinder.position.set(
      Math.random(i) * 100,
      Math.random(i) * 10,
      Math.random(i) * 300
    );

    for (let i = 0; i < sigs.length; i++) {
      audio1 = new THREE.PositionalAudio(listener);
      // audio1.setMediaElementSource(sigs[i]);
      audio1.setMediaElementSource(sig5);
      audio1.setDistanceModel("exponential");
      audio1.setRefDistance(10);
      audio1.setDirectionalCone(30, 100, 0);
      audio1.hasPlaybackControl = true;
      audio1.autoplay = true;

      // sigs[i].play();
      // sig5.play();

      const helper1 = new PositionalAudioHelper(audio1, 10);
      // audio1.add(helper1);

      cylinder.add(audio1);
    }

    cylinders.push(cylinder);
  }

  cylinders.tick = () => {
    var clock = new THREE.Clock();
    var elapsedTime = clock.getElapsedTime();
    const data = analyser.getFrequencyData();
    const dataAvg = analyser.getAverageFrequency();

    for (let i = 0; i < data.length; i++) {
      const value = 1;
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

      const velocity = new THREE.Vector3(otherMap, Math.sin(v), Math.cos(v));
      const acceleration = new THREE.Vector3(
        Math.sin(v),
        Math.sin(otherMap),
        v
      );

      for (let i = 0; i < cylinders.length; i++) {
        if (i === 0) {
          continue;
        }

        cylinders[i].scale.y += Math.sin(y);

        // if (dataAvg > 30) {
        //   cylinders[i].scale.z -= Math.sin(otherMap);
        // } else {
        //   cylinders[i].scale.z *= 0.1;
        // }

        if (Math.sin(v) >= 0 && Math.sin(v) <= Math.PI) {
          cylinders[i].rotation.z += Math.sin(v) * 0.001;
        } else {
          cylinders[i].rotation.x -= Math.sin(v) * 0.001;
        }

        const d = velocity.distanceTo(cylinders[i].position);

        if (d > 20 && d < 200) {
          velocity.multiplyScalar(-1);
        }

        cylinders[i].position.add(velocity);

        if (audio1) {
          cylinders[i].children[0].rotation.set(
            otherMap,
            Math.sin(v),
            Math.cos(y)
          );

          // cylinders[i].children[0].rotation.y += Math.sin(angle) * 10;
          cylinders[i].children[0].position.y += Math.sin(angle) * 0.1;
          angle += Math.sin(otherMap);
        }
        // audio1.rotation.x += Math.sin(angle);
        // audio1.position.y += Math.sin(y) * 0.1;
        // angle += Math.sin(otherMap);
      }

      const d = velocity.distanceTo(cylinders[0].position);

      cylinders[0].scale.y += Math.sin(y);

      if (d > 10 && d < 100) {
        velocity.multiplyScalar(-1);
        acceleration.multiplyScalar(-1);
      }
      cylinders[0].position.add(velocity);
      velocity.add(acceleration);

      audio.rotation.z = Math.sin(angle) * y;
      audio.position.x += Math.sin(y) * 0.01;
      angle += Math.sin(newMap);
    }
  };

  return cylinders;
}

export { createCylinder };
