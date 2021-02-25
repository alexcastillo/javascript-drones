const { Notion: Mind } = require("@neurosity/notion");
const exitHook = require("async-exit-hook");
const { linkDroneWithMind } = require("./mind");
const { Drone } = require("./drone");
const { Server } = require("./server");

const mind = new Mind();
const drone = new Drone();

linkDroneWithMind(mind, {
  onLift: () => drone.takeOff(),
  onDrop: () => drone.land()
  //onRotate: () => drone.flipBackwards(),
});

// For UI to control Drone as well
const server = new Server({
  onReceiveCommand: (command) => {
    drone.sendCommand(command);
  }
});

drone.on("message", (message) => {
  server.emit("status", message);
});

drone.onState("message", (message) => {
  server.emit("dronestate", message);
});

exitHook(() => {
  drone.land();
});
