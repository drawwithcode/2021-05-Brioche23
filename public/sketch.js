/*
Brioschi Alessio
Creative Coding 2021-22

Assignment_05


MOUSE
left click  : 

KEYS

*/
//  Activating socket io
let clientSocket = io();
let nPlayers = 0;
clientSocket.on("connect", newConnection);
clientSocket.on("mouseBroadcast", newBroadcast);
clientSocket.on("number", newNumber);
clientSocket.on("playerBroadcast", (data) => {
  console.log("PRENDO N PLAYER");
  nPlayers = data;
  console.log("nPlayers:", nPlayers);
});

function newConnection() {
  console.log(clientSocket.id);
}

function newBroadcast(data) {
  console.log(data);
  stroke(color(data.hue, 100, 100));
  line(data.px, data.py, data.x, data.y);
}

let n;
let index = 0;
let gotNumber = false;
function newNumber(data) {
  n = data;
  console.log("data:", data);
  switch (n % 3) {
    case 0:
      index = 3;
      break;
    case 1:
      index = 1;
      break;
    case 2:
      index = 2;
      break;
    default:
      index = 0;
  }
  if (index != 0) gotNumber = true;
  console.log("index-AAAA:", index);
  preload();
}

let img;
let font;
let song;
function preload() {
  console.log("preload!");
  font = loadFont("./assets/fonts/krabby-patty.ttf");
  song = loadSound("./assets/songs/spongebob.mp3");
  if (gotNumber) img = loadImage("./assets/img/" + index + ".png");
}

let hue;
let strokeColor;
function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#b0d7c4");
  // noStroke();
  strokeWeight(4);
  console.log("img:", img);
  imageMode(CENTER);
  image(
    img,
    (width / 3) * 2,
    height / 2,
    (img.width / img.height) * height,
    height
  );
  colorMode(HSB);
  hue = random(360);
  strokeColor = color(hue, 100, 100);
  textFont(font);
  rectMode(CENTER);
  // textLeading(60);
  textAlign(CENTER);
}

function draw() {
  console.log(n);

  push();
  noStroke();
  textSize(35);
  translate(width / 5, 100);
  text("The Handsomest of the Squidwards", 0, 0, width / 3);
  textSize(20);
  text(
    "Draw over the shapes that you see, or do whatever you want!",
    0,
    100,
    width / 3
  );
  // text("Drawing bois: " + nPlayers, 0, 200, width / 3);
  pop();
}
function mouseDragged() {
  stroke(strokeColor);

  strokeCap(ROUND);
  line(pmouseX, pmouseY, mouseX, mouseY);

  let message = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    hue: hue,
  };
  clientSocket.emit("mouse", message);

  if (!song.isPlaying()) {
    console.log("PLAY");
    song.loop();
  }
}

function mouseReleased() {
  console.log("PAUSE");
  song.pause();
}
