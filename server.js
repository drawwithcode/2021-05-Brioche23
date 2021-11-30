console.log("running the server!");
//  Load express
let express = require("express");
let app = express();
//  Defined port (for localhost)
//  Port created by heroku or Locally
const port = process.env.PORT || 8000;

//  Defined server and connection
let server = app.listen(port);
console.log("Server is running on https://localhost:" + port);

app.use(express.static("public"));

//  Import socket
let serverSocket = require("socket.io");
//  Assign the variable that runs the express
let io = serverSocket(server);
let connectedSockets = 0;
//  On connection run the newConnection() function
io.on("connection", newConnection);
io.on("disconnect", () => {
  connectedSockets--;
});

//  What happens when a new client connects
function newConnection(newSocket) {
  console.log(newSocket.id);
  connectedSockets++;
  // console.log("connectedSockets:", connectedSockets);
  newSocket.emit("number", connectedSockets);
  newSocket.on("mouse", mouseMessage);
  // newSocket.broadcast.emit("playerBroadcast", connectedSockets);

  function mouseMessage(message) {
    console.log("message:", message);
    //  Breadcasting the meassage to all the other clients
    newSocket.broadcast.emit("mouseBroadcast", message);
  }
}
