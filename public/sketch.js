/*
Brioschi Alessio
Creative Coding 2021-22

Assignment_05
"Collaorative Drawing:
create a web experience where more that two people can interact"

Idea
Create a platform where more people can complete the drawing
of Handsome Squidward 

MOUSE
left click + drag : draw line
*/

//  Activating socket io
let clientSocket = io();
let nPlayers = 0;
clientSocket.on("connect", newConnection);
clientSocket.on("mouseBroadcast", newBroadcast);
clientSocket.on("number", newNumber);
clientSocket.on("playerBroadcast", (data) => {
  nPlayers = data;
  console.log("nPlayers:", nPlayers);
});

function newConnection() {
  console.log(clientSocket.id);
}

//  Drawing the lines of the other clients
function newBroadcast(data) {
  console.log(data);
  //  Setting the color
  stroke(color(data.hue, 100, 100));
  //  Drawing the line
  line(data.px, data.py, data.x, data.y);
}

let n;
let index = 0;
let gotNumber = false;
//  Function to obtain how many players are connected so I can alternate the images displayed
function newNumber(data) {
  n = data;
  console.log("data:", data);
  //  Switch-case to get the right index of the image
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

  //  Calling the preload after getting the index
  preload();
}

let img;
let font;
let song;
//  Loading assets
function preload() {
  console.log("preload!");
  font = loadFont("./assets/fonts/krabby-patty.ttf");
  song = loadSound("./assets/songs/spongebob.mp3");
  //  If I got an Index then I can load the image too
  if (gotNumber) img = loadImage("./assets/img/" + index + ".png");
}

let hue;
let strokeColor;
//  Setting up the parameters
function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#b0d7c4");
  strokeWeight(4);
  imageMode(CENTER);
  //  Positioning the image
  image(
    img,
    (width / 3) * 2,
    height / 2,
    (img.width / img.height) * height,
    height
  );
  //  I use HSB so that I can pass only the HUE value to the server
  colorMode(HSB);
  hue = random(360);
  strokeColor = color(hue, 100, 100);
  textFont(font);
  rectMode(CENTER);
  textAlign(CENTER);
}

function draw() {
  //  Continuously draw the text so that it stays on top
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
  pop();
}

//  Draw the line and send message to the Server
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

  //  Play the song when I'm drawing
  if (!song.isPlaying()) {
    console.log("PLAY");
    song.loop();
  }
}

//  Pause the song when I release the mouse
function mouseReleased() {
  console.log("PAUSE");
  song.pause();
}
