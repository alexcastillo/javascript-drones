const dgram = require("dgram");
const throttle = require("lodash/throttle");

class Drone {
  host;
  port;
  statePort;

  constructor({
    host = "192.168.10.1",
    port = 8889,
    statePort = 8890
  } = {}) {
    this.host = host;
    this.port = port;
    this.statePort = statePort;
    this.drone = dgram.createSocket("udp4");
    this.state = dgram.createSocket("udp4");
    this.drone.bind(this.port);
    this.state.bind(this.statePort);
    this.sendCommand("command");
  }

  on(eventName, callback) {
    this.drone.on(eventName, (message) => {
      console.log(`🤖 : ${message}`);
      callback(message.toString());
    });
  }

  onState(eventName, callback) {
    this.state.on(
      eventName,
      throttle((state) => {
        const formattedState = Drone.parseState(state.toString());
        callback(formattedState);
      }, 100)
    );
  }

  sendCommand(command) {
    this.drone.send(
      command,
      0,
      command.length,
      this.port,
      this.host,
      Drone.onError
    );
  }

  takeOff() {
    this.sendCommand("takeoff");
  }

  land() {
    this.sendCommand("land");
  }

  flipBackwards() {
    this.sendCommand("flip b");
  }

  static parseState(state) {
    return state
      .split(";")
      .map((x) => x.split(":"))
      .reduce((data, [key, value]) => {
        data[key] = value;
        return data;
      }, {});
  }

  static onError(error) {
    if (error) {
      console.log("ERROR", error);
    }
  }
}

module.exports = { Drone };
