# Zoom clone coding

### Good to know

initialize npm. set up dev environment from here.
`npm init -y`

install nodemon. It will restart server if there are any changes.

`npm i nodemon -D`

install babel. babel is a complier for javascript.

`npm i @babel/core @babel/cli @babel/node @babel/preset -D`

install express. Framework for nodejs.

`npm i express`

install pug. It is a template engine for nodejs.

`npm i pug`

### Protocol

use for chat, notification and real-time stuff.

HTTP and Websocket are both communication protocols.

- HTTP: User send request -> Server response(forget user here) -> User send request ...
  - HTTP is stateless. back-end cannot remember the user. this is not real-time ops.
- Websocket: User send request -> Server accept -> This connection will establish until connection closed.
  - Websocket is bi-directional.

express only handle HTTP stuff. need to integrate express with Websocket.

to use websocket.

`npm i ws`

### SocketIO

SocketIO is not implementing websocket. it is a independent framework for websocket.

if there is no websocket. it will use other way(HTTP long-polling).

auto reconnect.

To install, `npm i socket.io`

SocketIO provides admin UI. To install `npm i @socket.io/admin-ui`

### Adapter

If there are many clients, you will need multiple servers naturally. the adapter helps communication for multiple servers.

- client A -> Server A -> MyDB Adapter -> MyDB
- client B -> Server B -> MyDB Adapter -> MyDB

### WebRTC

Web real-time communication.

Websocket is not peer-to-peer.

- client -> websocket -> server -> adapter -> DB -> adapter -> server -> client (broadcasting)

WebRTC is peer-to peer. direct connect to another client's browser.

### local tunnel

share your server to the world. temporarily free.

need to install global, `npm i -g localtunnel`

### STUN

allows computer find public IP.

You should run your own STUN server if you want to make a service based on WebRTC.

otherwise, you can use free STUN server that google provides. BUT! should not relay on this.

```js
myPeerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
});
```

### NOT TO USE WebRTC in this circumstances

- too many peers. It get slow because it is using Mesh-Architecture.

How to avoid?

- Use SFU(Selective forwarding Unit).
- Use RTC DataChannel.
