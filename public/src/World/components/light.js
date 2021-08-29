import * as THREE from "https://unpkg.com/three@0.121.1/build/three.module.js";

function createAmbient() {
  const ambientLight = new THREE.AmbientLight(0xa2b6d1, 0.8);

  return ambientLight;
}

function createDirectional() {
  const directionalLight = new THREE.DirectionalLight(0xc3ecff, 0.7);
  directionalLight.position.set(0, 10, 5);

  const d = 5;
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 20;

  directionalLight.shadow.mapSize.x = 1024;
  directionalLight.shadow.mapSize.y = 1024;

  return directionalLight;
}

export { createAmbient, createDirectional };
