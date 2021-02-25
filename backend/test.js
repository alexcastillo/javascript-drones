const exitHook = require("async-exit-hook");
const { Drone } = require("./drone");

const drone = new Drone();

drone.takeOff();

exitHook(() => {
  drone.land();
});
