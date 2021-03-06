import { World } from "./World/World.js";
// import { deviceControls } from "./main_phone.js";

let values, deviceControl, phoneControl, phoneOn;
let listenButton = document.getElementById("startButton");

let socket = io();
socket.on("connect", () => {
  console.log("listener connected");

  // socket.on("msgObj", (data) => {
  //   values = {
  //     alpha: data.alpha,
  //     beta: data.beta,
  //     gamma: data.gamma,
  //     enabled: data.enabled,
  //   };
  // });

  socket.on("msgObj", (data) => {
    deviceControl = {
      control: data.control,
      isOn: data.boolean,
    };
    phoneOn = deviceControl.isOn;
    phoneControl = deviceControl.control;
    console.log(phoneControl, phoneOn);
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

export { phoneControl, phoneOn };
