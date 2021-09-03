import { DeviceOrientationControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/DeviceOrientationControls.js";

function createDeviceControls(camera) {
  const deviceControls = new DeviceOrientationControls(camera);

  deviceControls.tick = () => {
    deviceControls.update();
    console.log("device Controls enabled");
  };

  return deviceControls;
}

export { createDeviceControls };
