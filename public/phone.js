let button = document.getElementById("button");
let a, b, c;
let alpha, beta, gamma;

let socket = io();

socket.on("connect", () => {
  console.log("phone connected");
});

button.addEventListener("click", sendData);

function sendData() {
  if (location.protocol != "https:") {
    location.href =
      "https:" +
      window.location.href.substring(window.location.protocol.length);
  }
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // (optional) Do something before API request prompt.
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        // (optional) Do something after API prompt dismissed.
        if (response == "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error);
  } else {
    alert("DeviceMotionEvent is not defined");
    // window.addEventListener("devicemotion", handleOrientation);
  }
}

function handleOrientation(event) {
  document.getElementById("alphaV").innerHTML = "";
  document.getElementById("betaV").innerHTML = "";
  document.getElementById("gammaV").innerHTML = "";

  //sensor refresh rate
  const updateRate = 1 / 30;

  // do something for 'e' here.
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;

  a = document.createElement("p");
  b = document.createElement("p");
  c = document.createElement("p");

  a.innerHTML = `alpha ${alpha}`; //360 (looking around)
  b.innerHTML = `beta: ${beta}`; //tilting forward and back
  c.innerHTML = `gamma: ${gamma}`; //tilting left and right

  document.getElementById("alphaV").appendChild(a);
  document.getElementById("betaV").appendChild(b);
  document.getElementById("gammaV").appendChild(c);

  let data = {
    dAlpha: alpha,
    dBeta: beta,
    dGamma: gamma,
  };
  socket.emit("msg", data);
}

function displayText() {
  setInterval(handleOrientation, 1000);
}
