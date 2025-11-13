let host;   // address of the websockets server
let socket; // the websocket connection
let connected = false;
let myInput, myButton;

let video;
let tracker

function setup() {
    createCanvas(200,200);

    myInput = createInput();
    myInput.value("host:port");
    myButton = createButton("Connect");
    myButton.mouseClicked(connectWebSocket);

    setupTracking();
}

// the connect button has been pressed, so try to make a connection
function connectWebSocket() {
  myButton.html("Connecting...");
  host = myInput.value();
  console.log("Trying to connect to ws://" + host);
  socket = new WebSocket('ws://' + host);
  socket.onopen = openHandler;
  socket.onerror = errorHandler;
  socket.onclose = closeHandler;
//   socket.onmessage = messageHandler;
}

// the connection has been made, so hide the host/port input and button
function openHandler() {
  console.log("Connected to " + host + " via WebSocket");
  connected = true;
  myInput.hide();
  myButton.hide();
}

// couldn't make a connection
function errorHandler(event) {
  connected = false;
  myButton.html("Failed!");
  myButton.style("color:red");
}

// connection was closed
function closeHandler() {
  console.log("Connection closed");
  connected = false;
}

let updateTracking = function () {
    if (connected == false) return;

    let positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        var obj = new Object();
        obj.noseX = positions[62][0];
        obj.noseY = positions[62][1];
        obj.mouthX = (positions[44][0] + positions[50][0]) / 2;
        obj.mouthY = (positions[47][1] + positions[53][1]) / 2;
        obj.mouthW = (positions[50][0] - positions[44][0]);
        obj.mouthH = (positions[53][1] - positions[47][1]);
        obj.eyeLX = positions[27][0];
        obj.eyeLY = positions[27][1];
        obj.eyeRX = positions[32][0];
        obj.eyeRY = positions[32][1];
        obj.distance = positions[32][0] - positions[27][0]
        socket.send(JSON.stringify(obj));
    }
}

function setupTracking() {
    let w = width, h = height;

    video = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function () {
        console.log('video ready.')
    });
    video.elt.setAttribute('playsinline', '');
    video.size(w, h);
    video.hide();

    tracker = new clm.tracker();
    tracker.init();
    tracker.start(video.elt);

    registerMethod('pre', updateTracking);
}

function draw() {
}
