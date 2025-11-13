# Face Tracking to Websockets

I made this as a way to get face tracking to happen easily in TouchDesigner since it didn't seem like there was a simple
way to make it happen. This method uses the [clmtrackr](https://github.com/auduno/clmtrackr) JavaScript library to do
the face tracking in your web browser, using your webcam. It then sends that data as JSON via a WebSocket to a waiting
server in TouchDesigner. 

## The Gist

### In TouchDesigner

1. Create a network with a **Web Server DAT**
2. Set that operator's "Port" parameter to a port number (like `12000`) and turn the "Active" parameter on
3. Edit the `onWebSocketReceiveText` function in the attached callbacks window to contain the line `op('text').text = data`
4. Create a **Text DAT** (named `text1`) and change its "Content Language" parameter to `JSON`
5. Connect the output of the Text DAT to a **JSON DAT** and change its "Output Format" parameter to `Table`
6. Connect the output of the JSON DAT to a **DAT to CHOP**

### In a Browser

1. Download the included three files and put them in a folder on your computer, then open `index.html` in your browser
2. Type the address and port of the server (e.g. `localhost:12000`) in text field and click Connect

If the connection from your browser to TouchDesigner via a WebSocket was successful then the browser should be blank.

If you want more information, you can open the browser's Console Log (F12 in my browser).

You should already be seeing channels of data about facial features appearing in TouchDesigner.

## Changing Which Features are Available

If you look at the map of landmarks in the [clmtrackr](https://github.com/auduno/clmtrackr) repo, you'll see that there
are a lot of individual points that can be tracked. Each point has x and y coordinates. If you want to track something
that this Javascript doesn't currently include, you can very easily change `sketch.js` so the `obj` object includes
the points you're interested. That's the only change that is necessary.

