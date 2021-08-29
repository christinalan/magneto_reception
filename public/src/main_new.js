import { World } from "./World/World.js";

let values;
let listenButton = document.getElementById("startButton");

let socket = io();
socket.on("connect", () => {
  console.log("listener connected");

  socket.on("msgObj", (data) => {
    values = {
      alpha: data.alpha,
      beta: data.beta,
      gamma: data.gamma,
    };
  });
});

function main() {
  const overlay = document.getElementById("overlay");
  overlay.remove();

  const container = document.getElementById("container");

  const world = new World(container);

  world.start();
}

listenButton.addEventListener("click", () => {
  console.log("starting audio");

  main();
});

export { values };
