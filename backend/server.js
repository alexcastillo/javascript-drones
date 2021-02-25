const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

class Server {
  constructor({ port = 6767, onReceiveCommand } = {}) {
    this.port = port;

    io.on("connection", (socket) => {
      socket.on("command", (command) => {
        console.log("command Sent from browser", command);
        onReceiveCommand && onReceiveCommand(command);
      });

      socket.emit("status", "CONNECTED");
    });

    http.listen(this.port, () => {
      console.log("Socket io server up and running");
    });
  }

  emit(eventName, message) {
    io.sockets.emit(eventName, message);
  }
}

module.exports = {
  Server
};
