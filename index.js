let express = require("express");
let app = express();

app.use("/", express.static("public"));

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

let http = require("http");
let server = http.createServer(app);

// let https = require("https");
// let fs = require("fs");
// let options = {
//   key: fs.readFileSync("./localhost-key.pem"),
//   cert: fs.readFileSync("./localhost.pem"),
// };

// let server = https.createServer(options, app);

let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("server is listening at port: " + port);
});

let io = require("socket.io")();
io.listen(server);

let broadcaster;

io.sockets.on("error", (e) => console.log(e));

io.sockets.on("connection", (socket) => {
  console.log("client connected " + socket.id);

  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });

  socket.on("listener", (message) => {
    console.log("client said:", message);
    socket.to(broadcaster).emit("listener", socket.id);
  });

  socket.on("msg", (data) => {
    // console.log(data);
    let msgObj = {
      alpha: data.dAlpha,
      beta: data.dBeta,
      gamma: data.dGamma,
    };
    // console.log(msgObj);
    socket.broadcast.emit("msgObj", msgObj);
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnected", socket.id);
  });
});
